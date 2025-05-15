import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from '../entities/task.entity';
import { User } from '../../users/entities/user.entity';
import { Project } from '../../project/entities/project.entity';
import { CreateTaskDto } from '../dto/create-task.dto';
import { UpdateTaskDto } from '../dto/update-task.dto';
import { TaskStatus } from '../enums/task-status.enum';
import { ERROR_MESSAGES } from '~/common/constants/error_messages';
import { ProjectRole } from '../../project/enums/project-role.enum';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Project)
    private projectRepository: Repository<Project>,
  ) {}

  private async checkProjectPermission(
    userId: number,
    projectCode: string,
    requiredRole: ProjectRole = ProjectRole.MEMBER,
  ): Promise<void> {
    const project = await this.projectRepository
      .createQueryBuilder('project')
      .innerJoin('project.members', 'member')
      .where('project.code = :projectCode', { projectCode })
      .andWhere('member.user_id = :userId', { userId })
      .andWhere('member.role >= :requiredRole', { requiredRole })
      .getOne();

    if (!project) {
      throw new ForbiddenException(ERROR_MESSAGES.insufficientPermissions);
    }
  }

  async create(userId: number, createTaskDto: CreateTaskDto): Promise<Task> {
    // Check if user has permission to create task in the project
    await this.checkProjectPermission(userId, createTaskDto.project_id, ProjectRole.MANAGER);

    // Check if project exists and is active
    const project = await this.projectRepository.findOne({
      where: { code: createTaskDto.project_id, isActive: true },
    });

    if (!project) {
      throw new NotFoundException(ERROR_MESSAGES.PROJECT_NOT_FOUND);
    }

    // Check if task code already exists
    const existingTask = await this.taskRepository.findOne({
      where: { code: createTaskDto.code },
    });

    if (existingTask) {
      throw new BadRequestException(ERROR_MESSAGES.TASK_CODE_ALREADY_EXISTS);
    }

    // Check if assignee exists if provided
    if (createTaskDto.assignee_id) {
      const assignee = await this.userRepository.findOne({
        where: { id: createTaskDto.assignee_id, isActive: true },
      });

      if (!assignee) {
        throw new NotFoundException(ERROR_MESSAGES.USER_NOT_FOUND);
      }
    }

    const task = this.taskRepository.create({
      ...createTaskDto,
      status: createTaskDto.status || TaskStatus.TODO,
      created_by: userId,
    });

    return this.taskRepository.save(task);
  }

  async findAll(projectCode: string): Promise<Task[]> {
    return this.taskRepository.find({
      where: { project_id: projectCode, isActive: true },
      relations: ['assignee', 'createdBy', 'updatedBy'],
    });
  }

  async findOne(id: number): Promise<Task> {
    const task = await this.taskRepository.findOne({
      where: { id },
      relations: ['assignee', 'createdBy', 'updatedBy', 'project'],
    });

    if (!task) {
      throw new NotFoundException(ERROR_MESSAGES.TASK_NOT_FOUND);
    }

    return task;
  }

  async update(
    userId: number,
    id: number,
    updateTaskDto: UpdateTaskDto,
  ): Promise<Task> {
    const task = await this.findOne(id);

    // Check if user has permission to update task in the project
    await this.checkProjectPermission(userId, task.project_id, ProjectRole.MANAGER);

    // Check if assignee exists if provided
    if (updateTaskDto.assignee_id) {
      const assignee = await this.userRepository.findOne({
        where: { id: updateTaskDto.assignee_id, isActive: true },
      });

      if (!assignee) {
        throw new NotFoundException(ERROR_MESSAGES.USER_NOT_FOUND);
      }
    }

    // Validate status transition
    if (updateTaskDto.status && task.status !== updateTaskDto.status) {
      this.validateStatusTransition(task.status, updateTaskDto.status);
    }

    Object.assign(task, {
      ...updateTaskDto,
      updated_by: userId,
    });

    return this.taskRepository.save(task);
  }

  private validateStatusTransition(
    currentStatus: TaskStatus,
    newStatus: TaskStatus,
  ): void {
    const validTransitions = {
      [TaskStatus.TODO]: [TaskStatus.IN_PROGRESS, TaskStatus.CANCELLED],
      [TaskStatus.IN_PROGRESS]: [TaskStatus.REVIEW, TaskStatus.CANCELLED],
      [TaskStatus.REVIEW]: [TaskStatus.COMPLETED, TaskStatus.IN_PROGRESS],
      [TaskStatus.COMPLETED]: [],
      [TaskStatus.CANCELLED]: [],
    };

    if ((!validTransitions[currentStatus] as any).includes(newStatus)) {
      throw new BadRequestException(
        `Cannot transition from ${currentStatus} to ${newStatus}`,
      );
    }
  }

  async remove(userId: number, id: number): Promise<void> {
    const task = await this.findOne(id);

    // Check if user has permission to delete task in the project
    await this.checkProjectPermission(
      userId,
      task.project_id,
      ProjectRole.MANAGER,
    );

    task.isActive = false;
    task.updated_by = userId;
    await this.taskRepository.save(task);
  }

  async assignTask(
    userId: number,
    taskId: number,
    assigneeId: number,
  ): Promise<Task> {
    const task = await this.findOne(taskId);
    const user = await this.userRepository.findOne({
      where: { id: assigneeId },
    });

    if (!user) {
      throw new NotFoundException(ERROR_MESSAGES.USER_NOT_FOUND);
    }

    task.assignee_id = assigneeId;
    task.updated_by = userId;

    return this.taskRepository.save(task);
  }

  async getProjectTasks(projectCode: string): Promise<Task[]> {
    const project = await this.projectRepository.findOne({
      where: { code: projectCode },
    });

    if (!project) {
      throw new NotFoundException(ERROR_MESSAGES.PROJECT_NOT_FOUND);
    }

    return this.taskRepository.find({
      where: { project_id: project.code },
      relations: ['assignee', 'createdBy', 'updatedBy'],
    });
  }

  async getUserTasks(userId: number): Promise<Task[]> {
    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException(ERROR_MESSAGES.USER_NOT_FOUND);
    }

    return this.taskRepository.find({
      where: { assignee_id: userId },
      relations: ['project', 'createdBy', 'updatedBy'],
    });
  }
}
