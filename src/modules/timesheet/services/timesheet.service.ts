import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, LessThanOrEqual, Not, IsNull } from 'typeorm';
import { DailyAttendance } from '../entities/daily_attendance.entity';
import { CreateTimesheetDto } from '../dto/create-timesheet.dto';
import { UpdateTimesheetDto } from '../dto/update-timesheet.dto';
import { User } from '../../users/entities/user.entity';
import { Project } from '../../project/entities/project.entity';
import { Task } from '../../task/entities/task.entity';
import { WorkingTime } from '../entities/working-time.entity';
import { ERROR_MESSAGES } from '~/common/constants/error_messages';

@Injectable()
export class TimesheetService {
  constructor(
    @InjectRepository(DailyAttendance)
    private timesheetRepository: Repository<DailyAttendance>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Project)
    private projectRepository: Repository<Project>,
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
    @InjectRepository(WorkingTime)
    private workingTimeRepository: Repository<WorkingTime>,
  ) {}

  async create(
    userId: number,
    createTimesheetDto: CreateTimesheetDto,
  ): Promise<DailyAttendance> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(ERROR_MESSAGES.USER_NOT_FOUND);
    }
    const existingTimesheet = await this.timesheetRepository.findOne({
      where: {
        user: { id: userId },
        date: createTimesheetDto.date,
      },
    });

    if (existingTimesheet) {
      throw new BadRequestException(ERROR_MESSAGES.TIMESHEET_ALREADY_CREATED);
    }

    const timesheet = new DailyAttendance();
    Object.assign(timesheet, {
      user,
      date: createTimesheetDto.date,
      status: 'pending',
      punishment_money: 0,
    });

    return await this.timesheetRepository.save(timesheet);
  }

  async checkIn(id: number, userId: number): Promise<DailyAttendance> {
    const timesheet = await this.findOne(id, userId);
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(ERROR_MESSAGES.USER_NOT_FOUND);
    }

    // Get current working time
    const workingTime = await this.workingTimeRepository.findOne({
      where: {
        user: { id: userId },
        status: 'approve',
        apply_date: LessThanOrEqual(new Date()),
      },
      order: { apply_date: 'DESC' },
    });

    if (!workingTime) {
      throw new BadRequestException(ERROR_MESSAGES.WORKING_TIME_NOT_FOUND);
    }

    const now = new Date();
    const currentTime = now.toTimeString().slice(0, 5); // Get HH:mm format
    const startMorningTime = workingTime.start_morning_time;
    const startAfternoonTime = workingTime.start_afternoon_time;

    // Check if late for morning or afternoon
    const isLate =
      (currentTime > startMorningTime && currentTime < startAfternoonTime) ||
      currentTime > startAfternoonTime;

    if (isLate) {
      const lateMinutes = this.calculateTimeDifference(
        currentTime,
        currentTime < startAfternoonTime
          ? startMorningTime
          : startAfternoonTime,
      );
      if (lateMinutes > 15) {
        timesheet.punishment_money += 30000; // 30k penalty for late > 15 minutes
      }
    }

    timesheet.check_in = currentTime;
    timesheet.updatedBy = user;

    return await this.timesheetRepository.save(timesheet);
  }

  async checkOut(id: number, userId: number): Promise<DailyAttendance> {
    const timesheet = await this.findOne(id, userId);
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(ERROR_MESSAGES.USER_NOT_FOUND);
    }

    if (!timesheet.check_in) {
      throw new BadRequestException(
        ERROR_MESSAGES.MUST_CHECK_IN_BEFORE_CHECKING_OUT,
      );
    }

    // Get current working time
    const workingTime = await this.workingTimeRepository.findOne({
      where: {
        user: { id: userId },
        status: 'approve',
        apply_date: LessThanOrEqual(new Date()),
      },
      order: { apply_date: 'DESC' },
    });

    if (!workingTime) {
      throw new BadRequestException(ERROR_MESSAGES.WORKING_TIME_NOT_FOUND);
    }

    const now = new Date();
    const currentTime = now.toTimeString().slice(0, 5); // Get HH:mm format
    const endMorningTime = workingTime.end_morning_time;
    const endAfternoonTime = workingTime.end_afternoon_time;

    // Check if early leave
    const isEarlyLeave =
      (currentTime < endMorningTime && timesheet.check_in < endMorningTime) ||
      (currentTime < endAfternoonTime && timesheet.check_in >= endMorningTime);

    if (isEarlyLeave) {
      const earlyMinutes = this.calculateTimeDifference(
        currentTime,
        currentTime < endAfternoonTime ? endMorningTime : endAfternoonTime,
      );
      if (earlyMinutes > 15) {
        timesheet.punishment_money += 30000; // 30k penalty for early leave > 15 minutes
      }
    }

    timesheet.check_out = currentTime;
    timesheet.updatedBy = user;

    return await this.timesheetRepository.save(timesheet);
  }

  async updateDaily(
    id: number,
    userId: number,
    updateTimesheetDto: UpdateTimesheetDto,
  ): Promise<DailyAttendance> {
    const timesheet = await this.findOne(id, userId);
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(ERROR_MESSAGES.USER_NOT_FOUND);
    }

    // Check if current time is within daily update hours (7:00 - 17:00)
    const now = new Date();
    const currentTime = now.toTimeString().slice(0, 5); // Get HH:mm format
    if (currentTime < '07:00' || currentTime > '17:00') {
      throw new BadRequestException(ERROR_MESSAGES.DAILY_UPDATE_HOURS);
    }

    // Only allow updates if status is pending
    if (timesheet.status !== 'pending') {
      throw new BadRequestException(ERROR_MESSAGES.TIMESHEET_NOT_UPDATED);
    }

    if (updateTimesheetDto.project_code) {
      const project = await this.projectRepository.findOne({
        where: { code: updateTimesheetDto.project_code },
      });
      if (!project) {
        throw new NotFoundException(ERROR_MESSAGES.PROJECT_NOT_FOUND);
      }
      timesheet.project = project;
    }

    if (updateTimesheetDto.task_id) {
      const task = await this.taskRepository.findOne({
        where: { id: parseInt(updateTimesheetDto.task_id) },
      });
      if (!task) {
        throw new NotFoundException(ERROR_MESSAGES.TASK_NOT_FOUND);
      }
      timesheet.task = task;
    }

    if (updateTimesheetDto.note) {
      timesheet.note = updateTimesheetDto.note;
    }

    timesheet.updatedBy = user;

    return await this.timesheetRepository.save(timesheet);
  }

  private calculateTimeDifference(time1: string, time2: string): number {
    const [hours1, minutes1] = time1.split(':').map(Number);
    const [hours2, minutes2] = time2.split(':').map(Number);
    return Math.abs(hours1 * 60 + minutes1 - (hours2 * 60 + minutes2));
  }

  async findAll(userId: number): Promise<DailyAttendance[]> {
    return await this.timesheetRepository.find({
      where: { user: { id: userId } },
      relations: ['user', 'project', 'task', 'updatedBy', 'approvedBy'],
      order: { date: 'DESC' },
    });
  }

  async findOne(id: number, userId: number): Promise<DailyAttendance> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(ERROR_MESSAGES.USER_NOT_FOUND);
    }

    const timesheet = await this.timesheetRepository.findOne({
      where: { id },
      relations: ['user', 'project', 'task', 'updatedBy', 'approvedBy'],
    });

    if (!timesheet) {
      throw new NotFoundException(ERROR_MESSAGES.TIMESHEET_NOT_FOUND);
    }
    return timesheet;
  }

  async getProjectTimesheets(
    userId: number,
    projectId: string,
  ): Promise<DailyAttendance[]> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(ERROR_MESSAGES.USER_NOT_FOUND);
    }

    const project = await this.projectRepository.findOne({
      where: { code: projectId },
    });

    if (!project) {
      throw new NotFoundException(ERROR_MESSAGES.PROJECT_NOT_FOUND);
    }
    return await this.timesheetRepository.find({
      where: { project: { code: projectId } },
      relations: ['user', 'project', 'task', 'updatedBy', 'approvedBy'],
      order: { date: 'DESC' },
    });
  }

  async getTaskTimesheets(
    userId: number,
    taskId: number,
  ): Promise<DailyAttendance[]> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(ERROR_MESSAGES.USER_NOT_FOUND);
    }

    const task = await this.taskRepository.findOne({
      where: { id: taskId },
    });

    if (!task) {
      throw new NotFoundException(ERROR_MESSAGES.TASK_NOT_FOUND);
    }

    return await this.timesheetRepository.find({
      where: { task: { id: taskId } },
      relations: ['user', 'project', 'task', 'updatedBy', 'approvedBy'],
      order: { date: 'DESC' },
    });
  }

  async submit(id: number, userId: number): Promise<DailyAttendance> {
    const timesheet = await this.findOne(id, userId);
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(ERROR_MESSAGES.USER_NOT_FOUND);
    }

    if (timesheet.status !== 'pending') {
      throw new BadRequestException(ERROR_MESSAGES.TIMESHEET_NOT_UPDATED);
    }

    timesheet.status = 'submit';
    timesheet.updatedBy = user;

    return await this.timesheetRepository.save(timesheet);
  }

  async approve(id: number, userId: number): Promise<DailyAttendance> {
    const timesheet = await this.findOne(id, userId);
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(ERROR_MESSAGES.USER_NOT_FOUND);
    }

    if (timesheet.status !== 'submit') {
      throw new BadRequestException(ERROR_MESSAGES.TIMESHEET_NOT_UPDATED);
    }

    timesheet.status = 'approve';
    timesheet.approvedBy = user;
    timesheet.approved_at = new Date();
    timesheet.updatedBy = user;

    return await this.timesheetRepository.save(timesheet);
  }

  async reject(
    id: number,
    userId: number,
    reason: string,
  ): Promise<DailyAttendance> {
    const timesheet = await this.findOne(id, userId);
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(ERROR_MESSAGES.USER_NOT_FOUND);
    }

    if (timesheet.status !== 'submit') {
      throw new BadRequestException(ERROR_MESSAGES.TIMESHEET_NOT_UPDATED);
    }

    timesheet.status = 'reject';
    timesheet.note = reason;
    timesheet.updatedBy = user;

    return await this.timesheetRepository.save(timesheet);
  }

  async createComplaint(
    id: number,
    userId: number,
    content: string,
  ): Promise<DailyAttendance> {
    const timesheet = await this.findOne(id, userId);
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(ERROR_MESSAGES.USER_NOT_FOUND);
    }

    if (timesheet.status !== 'reject') {
      throw new BadRequestException(
        ERROR_MESSAGES.CAN_ONLY_CREATE_COMPLAINTS_FOR_REJECTED_TIMESHEETS,
      );
    }

    timesheet.complaint = content;
    timesheet.complaint_status = 'pending';
    timesheet.updatedBy = user;

    return await this.timesheetRepository.save(timesheet);
  }

  async replyComplaint(
    id: number,
    userId: number,
    content: string,
  ): Promise<DailyAttendance> {
    const timesheet = await this.findOne(id, userId);
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(ERROR_MESSAGES.USER_NOT_FOUND);
    }

    if (!timesheet.complaint) {
      throw new BadRequestException(ERROR_MESSAGES.NO_COMPLAINT_FOUND_FOR_THIS_TIMESHEET);
    }

    timesheet.complaint_reply = content;
    timesheet.complaintRepliedBy = user;
    timesheet.complaint_replied_at = new Date();
    timesheet.complaint_status = 'replied';
    timesheet.updatedBy = user;

    return await this.timesheetRepository.save(timesheet);
  }

  async getComplaints(userId: number): Promise<DailyAttendance[]> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(ERROR_MESSAGES.USER_NOT_FOUND);
    }

    return await this.timesheetRepository.find({
      where: { user: { id: userId }, complaint: Not(IsNull()) },
      relations: ['user', 'project', 'task', 'updatedBy', 'complaintRepliedBy'],
      order: { created_at: 'DESC' },
    });
  }

  async getComplaint(id: number, userId: number): Promise<DailyAttendance> {
    const timesheet = await this.findOne(id, userId);
    if (!timesheet.complaint) {
      throw new NotFoundException(ERROR_MESSAGES.NO_COMPLAINT_FOUND_FOR_THIS_TIMESHEET);
    }
    return timesheet;
  }
}
