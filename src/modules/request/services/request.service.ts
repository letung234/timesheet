import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Request } from '../entities/request.entity';
import { User } from '../../users/entities/user.entity';
import { DailyAttendance } from '../../timesheet/entities/daily_attendance.entity';
import { CreateRequestDto } from '../dto/create-request.dto';
import { UpdateRequestDto } from '../dto/update-request.dto';
import { RequestStatus } from '../enums/request-status.enum';
import { RequestType } from '../enums/request-type.enum';
import { AbsenceType } from '../enums/absence-type.enum';
import { ERROR_MESSAGES } from '~/common/constants/error_messages';
import { ProjectService } from '../../project/services/project.service';
import { ProjectRole } from '../../project/enums/project-role.enum';

@Injectable()
export class RequestService {
  constructor(
    @InjectRepository(Request)
    private requestRepository: Repository<Request>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(DailyAttendance)
    private dailyAttendanceRepository: Repository<DailyAttendance>,
    private projectService: ProjectService,
  ) {}

  async create(
    userId: number,
    createRequestDto: CreateRequestDto,
  ): Promise<Request> {
    // Check if daily attendance exists
    const dailyAttendance = await this.dailyAttendanceRepository.findOne({
      where: { id: createRequestDto.daily_attendance_id },
    });

    if (!dailyAttendance) {
      throw new NotFoundException(ERROR_MESSAGES.DAILY_ATTENDANCE_NOT_FOUND);
    }

    // Check if request code already exists
    const existingRequest = await this.requestRepository.findOne({
      where: { code: createRequestDto.code },
    });

    if (existingRequest) {
      throw new BadRequestException(ERROR_MESSAGES.REQUEST_CODE_ALREADY_EXISTS);
    }

    // Validate time if provided
    if (
      createRequestDto.start_time &&
      createRequestDto.end_time &&
      createRequestDto.start_time >= createRequestDto.end_time
    ) {
      throw new BadRequestException(
        ERROR_MESSAGES.START_TIME_MUST_BE_BEFORE_END_TIME,
      );
    }

    // Validate absence type for leave requests
    if (
      createRequestDto.type === RequestType.LEAVE &&
      !createRequestDto.absence_type
    ) {
      throw new BadRequestException(
        ERROR_MESSAGES.ABSENCE_TYPE_REQUIRED_FOR_LEAVE_REQUESTS,
      );
    }

    const request = this.requestRepository.create({
      ...createRequestDto,
      requester_id: userId,
      created_by: userId,
    });

    return this.requestRepository.save(request);
  }

  async findAll(
    userId: number,
    startDate?: string,
    endDate?: string,
  ): Promise<Request[]> {
    const queryBuilder = this.requestRepository
      .createQueryBuilder('request')
      .leftJoinAndSelect('request.requester', 'requester')
      .leftJoinAndSelect('request.approver', 'approver')
      .leftJoinAndSelect('request.createdBy', 'createdBy')
      .leftJoinAndSelect('request.updatedBy', 'updatedBy')
      .leftJoinAndSelect('request.dailyAttendance', 'dailyAttendance')
      .where('request.isActive = :isActive', { isActive: true })
      .andWhere(
        '(request.requester_id = :userId OR request.approver_id = :userId)',
        { userId },
      );

    if (startDate) {
      queryBuilder.andWhere('request.start_date >= :startDate', { startDate });
    }
    if (endDate) {
      queryBuilder.andWhere('request.end_date <= :endDate', { endDate });
    }

    return queryBuilder.getMany();
  }

  async findOne(id: number, userId: number): Promise<Request> {
    const request = await this.requestRepository.findOne({
      where: { id },
      relations: [
        'requester',
        'approver',
        'createdBy',
        'updatedBy',
        'dailyAttendance',
      ],
    });

    if (!request) {
      throw new NotFoundException('Request not found');
    }

    // Check if user has permission to view the request
    if (
      request.requester_id !== userId &&
      request.approver_id !== userId &&
      !(await this.isAdmin(userId)) &&
      !(await this.isProjectManager(userId, request.project_id)) &&
      !(await this.isProjectAdmin(userId, request.project_id))
    ) {
      throw new ForbiddenException(ERROR_MESSAGES.insufficientPermissions);
    }

    return request;
  }

  async update(
    userId: number,
    id: number,
    updateRequestDto: UpdateRequestDto,
  ): Promise<Request> {
    const request = await this.findOne(id, userId);

    // Only requester can update pending requests
    if (request.requester_id !== userId) {
      throw new ForbiddenException(
        ERROR_MESSAGES.ONLY_REQUESTER_CAN_UPDATE_REQUEST,
      );
    }

    if (request.status !== RequestStatus.PENDING) {
      throw new BadRequestException(
        ERROR_MESSAGES.CANNOT_UPDATE_NON_PENDING_REQUEST,
      );
    }

    // Validate dates if provided
    if (
      updateRequestDto.start_date &&
      updateRequestDto.end_date &&
      updateRequestDto.start_date > updateRequestDto.end_date
    ) {
      throw new BadRequestException(
        ERROR_MESSAGES.START_DATE_MUST_BE_BEFORE_END_DATE,
      );
    }

    // Validate absence type for leave requests
    if (
      updateRequestDto.type === RequestType.LEAVE &&
      !updateRequestDto.absence_type
    ) {
      throw new BadRequestException(
        ERROR_MESSAGES.ABSENCE_TYPE_REQUIRED_FOR_LEAVE_REQUESTS,
      );
    }

    Object.assign(request, {
      ...updateRequestDto,
      updated_by: userId,
    });

    return this.requestRepository.save(request);
  }

  async approve(
    userId: number,
    id: number,
    rejectionReason?: string,
  ): Promise<Request> {
    const request = await this.findOne(id, userId);

    // Check if request is pending
    if (request.status !== RequestStatus.PENDING) {
      throw new BadRequestException(ERROR_MESSAGES.REQUEST_NOT_PENDING);
    }

    // Check if user is project manager
    if (request.project_id) {
      const isProjectManager = await this.projectService.checkProjectPermission(
        userId,
        request.project_id,
        ProjectRole.MANAGER,
      );

      if (!isProjectManager) {
        throw new ForbiddenException(
          ERROR_MESSAGES.ONLY_PROJECT_MANAGER_CAN_APPROVE,
        );
      }
    }

    request.status = rejectionReason
      ? RequestStatus.REJECTED
      : RequestStatus.APPROVED;
    request.rejection_reason = rejectionReason || null;
    request.approver_id = userId;
    request.updated_by = userId;

    return this.requestRepository.save(request);
  }

  async cancel(userId: number, id: number): Promise<Request> {
    const request = await this.findOne(id, userId);

    // Only requester can cancel pending requests
    if (request.requester_id !== userId) {
      throw new ForbiddenException(ERROR_MESSAGES.ONLY_REQUESTER_CAN_CANCEL);
    }

    if (request.status !== RequestStatus.PENDING) {
      throw new BadRequestException(ERROR_MESSAGES.CANNOT_CANCEL_NON_PENDING_REQUEST);
    }

    request.status = RequestStatus.CANCELLED;
    request.updated_by = userId;

    return this.requestRepository.save(request);
  }

  private async isAdmin(userId: number): Promise<boolean> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['roles'],
    });

    return user?.roles.some((role) => role.name === 'admin') || false;
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
}
