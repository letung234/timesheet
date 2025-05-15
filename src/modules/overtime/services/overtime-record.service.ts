import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OvertimeRecord } from '../entities/overtime-record.entity';
import { Project } from '../../project/entities/project.entity';
import { CreateOvertimeRecordDto } from '../dto/create-overtime-record.dto';
import { UpdateOvertimeRecordDto } from '../dto/update-overtime-record.dto';
import { ERROR_MESSAGES } from '~/common/constants/error_messages';
import { ProjectService } from '../../project/services/project.service';
import { ProjectRole } from '../../project/enums/project-role.enum';

@Injectable()
export class OvertimeRecordService {
  constructor(
    @InjectRepository(OvertimeRecord)
    private overtimeRecordRepository: Repository<OvertimeRecord>,
    @InjectRepository(Project)
    private projectRepository: Repository<Project>,
    private projectService: ProjectService,
  ) {}

  async create(
    userId: number,
    createOvertimeRecordDto: CreateOvertimeRecordDto,
  ): Promise<OvertimeRecord> {
    // Check if project exists
    const project = await this.projectRepository.findOne({
      where: { code: createOvertimeRecordDto.project_code },
    });

    if (!project) {
      throw new NotFoundException(ERROR_MESSAGES.PROJECT_NOT_FOUND);
    }

    // Check if user is project member
    const isProjectMember = await this.projectService.checkProjectPermission(
      userId,
      createOvertimeRecordDto.project_code,
      ProjectRole.MEMBER,
    );

    if (!isProjectMember) {
      throw new ForbiddenException(ERROR_MESSAGES.insufficientPermissions);
    }

    // Validate time
    if (
      createOvertimeRecordDto.start_time >= createOvertimeRecordDto.end_time
    ) {
      throw new BadRequestException(
        ERROR_MESSAGES.START_TIME_MUST_BE_BEFORE_END_TIME,
      );
    }

    // Calculate total hours
    const totalHours = this.calculateTotalHours(
      createOvertimeRecordDto.start_time,
      createOvertimeRecordDto.end_time,
    );

    const overtimeRecord = this.overtimeRecordRepository.create({
      ...createOvertimeRecordDto,
      user_id: userId,
      created_by: userId,
      total_hours: totalHours,
      status: 'PENDING',
    });

    return this.overtimeRecordRepository.save(overtimeRecord);
  }

  async findAll(userId: number): Promise<OvertimeRecord[]> {
    return this.overtimeRecordRepository.find({
      where: { user_id: userId, isActive: true },
      relations: ['user', 'project', 'approver', 'createdBy', 'updatedBy'],
    });
  }

  async findOne(id: number, userId: number): Promise<OvertimeRecord> {
    const overtimeRecord = await this.overtimeRecordRepository.findOne({
      where: { id },
      relations: ['user', 'project', 'approver', 'createdBy', 'updatedBy'],
    });

    if (!overtimeRecord) {
      throw new NotFoundException(ERROR_MESSAGES.OVERTIME_RECORD_NOT_FOUND);
    }

    // Check if user has permission to view the record
    if (
      overtimeRecord.user_id !== userId &&
      !(await this.isProjectManager(userId, overtimeRecord.project_code)) &&
      !(await this.isProjectAdmin(userId, overtimeRecord.project_code))
    ) {
      throw new ForbiddenException(ERROR_MESSAGES.insufficientPermissions);
    }

    return overtimeRecord;
  }

  async update(
    userId: number,
    id: number,
    updateOvertimeRecordDto: UpdateOvertimeRecordDto,
  ): Promise<OvertimeRecord> {
    const overtimeRecord = await this.findOne(id, userId);

    // Only record owner can update
    if (overtimeRecord.user_id !== userId) {
      throw new ForbiddenException(ERROR_MESSAGES.ONLY_OWNER_CAN_UPDATE);
    }

    // Cannot update if already approved or rejected
    if (overtimeRecord.status !== 'PENDING') {
      throw new BadRequestException(
        ERROR_MESSAGES.CANNOT_UPDATE_NON_PENDING_RECORD,
      );
    }

    // Validate time if provided
    if (
      updateOvertimeRecordDto.start_time &&
      updateOvertimeRecordDto.end_time &&
      updateOvertimeRecordDto.start_time >= updateOvertimeRecordDto.end_time
    ) {
      throw new BadRequestException(
        ERROR_MESSAGES.START_TIME_MUST_BE_BEFORE_END_TIME,
      );
    }

    // Calculate total hours if time is updated
    let totalHours = overtimeRecord.total_hours;
    if (
      updateOvertimeRecordDto.start_time &&
      updateOvertimeRecordDto.end_time
    ) {
      totalHours = this.calculateTotalHours(
        updateOvertimeRecordDto.start_time,
        updateOvertimeRecordDto.end_time,
      );
    }

    Object.assign(overtimeRecord, {
      ...updateOvertimeRecordDto,
      total_hours: totalHours,
      updated_by: userId,
    });

    return this.overtimeRecordRepository.save(overtimeRecord);
  }

  async remove(userId: number, id: number): Promise<void> {
    const overtimeRecord = await this.findOne(id, userId);

    // Only record owner can delete
    if (overtimeRecord.user_id !== userId) {
      throw new ForbiddenException(ERROR_MESSAGES.ONLY_OWNER_CAN_DELETE);
    }

    // Cannot delete if already approved or rejected
    if (overtimeRecord.status !== 'PENDING') {
      throw new BadRequestException(
        ERROR_MESSAGES.CANNOT_DELETE_NON_PENDING_RECORD,
      );
    }

    overtimeRecord.isActive = false;
    overtimeRecord.updated_by = userId;
    await this.overtimeRecordRepository.save(overtimeRecord);
  }

  async approve(
    userId: number,
    id: number,
    rejectionReason?: string,
  ): Promise<OvertimeRecord> {
    const overtimeRecord = await this.findOne(id, userId);

    // Check if user is project manager
    const isProjectManager = await this.isProjectManager(
      userId,
      overtimeRecord.project_code,
    );

    if (!isProjectManager) {
      throw new ForbiddenException(
        ERROR_MESSAGES.ONLY_PROJECT_MANAGER_CAN_APPROVE,
      );
    }

    // Check if record is pending
    if (overtimeRecord.status !== 'PENDING') {
      throw new BadRequestException(ERROR_MESSAGES.RECORD_NOT_PENDING);
    }

    overtimeRecord.status = rejectionReason ? 'REJECTED' : 'APPROVED';
    overtimeRecord.rejection_reason = rejectionReason || null;
    overtimeRecord.approver_id = userId;
    overtimeRecord.updated_by = userId;

    return this.overtimeRecordRepository.save(overtimeRecord);
  }

  private async isProjectManager(
    userId: number,
    projectId: string,
  ): Promise<boolean> {
    return this.projectService.checkProjectPermission(
      userId,
      projectId,
      ProjectRole.MANAGER,
    );
  }

  private async isProjectAdmin(
    userId: number,
    projectId: string,
  ): Promise<boolean> {
    return this.projectService.checkProjectPermission(
      userId,
      projectId,
      ProjectRole.ADMIN,
    );
  }

  private calculateTotalHours(startTime: string, endTime: string): number {
    const [startHours, startMinutes] = startTime.split(':').map(Number);
    const [endHours, endMinutes] = endTime.split(':').map(Number);

    let totalMinutes =
      endHours * 60 + endMinutes - (startHours * 60 + startMinutes);
    if (totalMinutes < 0) {
      totalMinutes += 24 * 60;
    }

    return Number((totalMinutes / 60).toFixed(2));
  }
}
