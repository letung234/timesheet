import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from '../entities/project.entity';
import { ProjectMember } from '../entities/project-member.entity';
import { User } from '../../users/entities/user.entity';
import { Customer } from '../entities/customer.entity';
import { CreateProjectDto } from '../dto/create-project.dto';
import { UpdateProjectDto } from '../dto/update-project.dto';
import { ProjectStatus } from '../enums/project-status.enum';
import { ProjectRole } from '../enums/project-role.enum';
import { AddMemberDto } from '../dto/add-member.dto';
import { ERROR_MESSAGES } from '~/common/constants/error_messages';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(Project)
    private projectRepository: Repository<Project>,
    @InjectRepository(ProjectMember)
    private projectMemberRepository: Repository<ProjectMember>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Customer)
    private customerRepository: Repository<Customer>,
  ) {}

  private async checkAdminPermission(
    userId: number,
    projectCode: string,
  ): Promise<void> {
    const member = await this.projectMemberRepository.findOne({
      where: { project_id: projectCode, user_id: userId },
    });

    if (!member || member.role !== ProjectRole.ADMIN) {
      throw new ForbiddenException(ERROR_MESSAGES.ONLY_ADMIN_CAN_ADD_MEMBERS);
    }
  }

  async create(
    userId: number,
    createProjectDto: CreateProjectDto,
  ): Promise<Project> {
    const existingProject = await this.projectRepository.findOne({
      where: { code: createProjectDto.code },
    });

    if (existingProject) {
      throw new BadRequestException(ERROR_MESSAGES.PROJECT_CODE_ALREADY_EXISTS);
    }

    // Check if customer exists if customer_id is provided
    if (createProjectDto.customer_id) {
      const customer = await this.customerRepository.findOne({
        where: { id: createProjectDto.customer_id, isActive: true },
      });

      if (!customer) {
        throw new NotFoundException(ERROR_MESSAGES.CUSTOMER_NOT_FOUND);
      }
    }

    const project = this.projectRepository.create({
      ...createProjectDto,
      status: createProjectDto.status || ProjectStatus.PENDING,
      created_by: userId,
    });

    const savedProject = await this.projectRepository.save(project);

    // Add creator as project admin
    await this.projectMemberRepository.save({
      project_id: savedProject.code,
      user_id: userId,
      role: ProjectRole.ADMIN,
      added_by: userId,
    });

    return savedProject;
  }

  async findAll(): Promise<Project[]> {
    return this.projectRepository.find({
      where: { isActive: true },
      relations: ['createdBy', 'updatedBy', 'customer'],
    });
  }

  async findOne(code: string): Promise<Project> {
    const project = await this.projectRepository.findOne({
      where: { code },
      relations: ['createdBy', 'updatedBy', 'customer'],
    });

    if (!project) {
      throw new NotFoundException(ERROR_MESSAGES.PROJECT_NOT_FOUND);
    }

    return project;
  }

  async update(
    userId: number,
    code: string,
    updateProjectDto: UpdateProjectDto,
  ): Promise<Project> {
    await this.checkAdminPermission(userId, code);
    const project = await this.findOne(code);

    // Check if customer exists if customer_id is provided
    if (updateProjectDto.customer_id) {
      const customer = await this.customerRepository.findOne({
        where: { id: updateProjectDto.customer_id, isActive: true },
      });

      if (!customer) {
        throw new NotFoundException(ERROR_MESSAGES.CUSTOMER_NOT_FOUND);
      }
    }

    // Validate status transition
    if (updateProjectDto.status && project.status !== updateProjectDto.status) {
      this.validateStatusTransition(project.status, updateProjectDto.status);
    }

    Object.assign(project, {
      ...updateProjectDto,
      updated_by: userId,
    });

    return this.projectRepository.save(project);
  }

  private validateStatusTransition(
    currentStatus: ProjectStatus,
    newStatus: ProjectStatus,
  ): void {
    const validTransitions = {
      [ProjectStatus.PENDING]: [
        ProjectStatus.IN_PROGRESS,
        ProjectStatus.CANCELLED,
      ],
      [ProjectStatus.IN_PROGRESS]: [
        ProjectStatus.COMPLETED,
        ProjectStatus.ON_HOLD,
        ProjectStatus.CANCELLED,
      ],
      [ProjectStatus.ON_HOLD]: [
        ProjectStatus.IN_PROGRESS,
        ProjectStatus.CANCELLED,
      ],
      [ProjectStatus.COMPLETED]: [ProjectStatus.PAID, ProjectStatus.REVIEW],
      [ProjectStatus.REVIEW]: [
        ProjectStatus.COMPLETED,
        ProjectStatus.IN_PROGRESS,
      ],
      [ProjectStatus.PAID]: [],
      [ProjectStatus.CANCELLED]: [],
    };

    if ((!validTransitions[currentStatus] as any).includes(newStatus)) {
      throw new BadRequestException(
        `Cannot transition from ${currentStatus} to ${newStatus}`,
      );
    }
  }

  async remove(userId: number, code: string): Promise<void> {
    await this.checkAdminPermission(userId, code);
    const project = await this.findOne(code);
    project.isActive = false;
    project.status = ProjectStatus.CANCELLED;
    project.updated_by = userId;
    await this.projectRepository.save(project);
  }

  async addMember(
    userId: number,
    code: string,
    addMemberDto: AddMemberDto,
  ): Promise<ProjectMember> {
    await this.checkAdminPermission(userId, code);
    const project = await this.findOne(code);

    const user = await this.userRepository.findOne({
      where: { id: addMemberDto.userId },
    });

    if (!user) {
      throw new NotFoundException(ERROR_MESSAGES.USER_NOT_FOUND);
    }

    const existingMember = await this.projectMemberRepository.findOne({
      where: { project_id: code, user_id: addMemberDto.userId },
    });

    if (existingMember) {
      throw new BadRequestException(
        ERROR_MESSAGES.USER_ALREADY_A_MEMBER_OF_THIS_PROJECT,
      );
    }

    const member = this.projectMemberRepository.create({
      project_id: code,
      user_id: addMemberDto.userId,
      role: addMemberDto.role,
      added_by: userId,
    });

    return this.projectMemberRepository.save(member);
  }

  async removeMember(
    userId: number,
    code: string,
    memberUserId: number,
  ): Promise<void> {
    await this.checkAdminPermission(userId, code);
    const project = await this.findOne(code);

    const member = await this.projectMemberRepository.findOne({
      where: { project_id: code, user_id: memberUserId },
    });

    if (!member) {
      throw new NotFoundException(ERROR_MESSAGES.PROJECT_MEMBER_NOT_FOUND);
    }

    // Prevent removing the last admin
    if (member.role === ProjectRole.ADMIN) {
      const adminCount = await this.projectMemberRepository.count({
        where: { project_id: code, role: ProjectRole.ADMIN },
      });

      if (adminCount <= 1) {
        throw new BadRequestException(ERROR_MESSAGES.CANNOT_REMOVE_LAST_ADMIN);
      }
    }

    await this.projectMemberRepository.remove(member);
  }

  async getMembers(code: string): Promise<ProjectMember[]> {
    return this.projectMemberRepository.find({
      where: { project_id: code },
      relations: ['user'],
    });
  }

  async updateMemberRole(
    userId: number,
    code: string,
    memberUserId: number,
    newRole: ProjectRole,
  ): Promise<ProjectMember> {
    await this.checkAdminPermission(userId, code);
    const project = await this.findOne(code);

    const member = await this.projectMemberRepository.findOne({
      where: { project_id: code, user_id: memberUserId },
    });

    if (!member) {
      throw new NotFoundException(ERROR_MESSAGES.PROJECT_MEMBER_NOT_FOUND);
    }

    // Prevent changing role of the last admin
    if (member.role === ProjectRole.ADMIN && newRole !== ProjectRole.ADMIN) {
      const adminCount = await this.projectMemberRepository.count({
        where: { project_id: code, role: ProjectRole.ADMIN },
      });

      if (adminCount <= 1) {
        throw new BadRequestException(
          ERROR_MESSAGES.CANNOT_CHANGE_LAST_ADMIN_ROLE,
        );
      }
    }

    member.role = newRole;
    return this.projectMemberRepository.save(member);
  }

  async checkProjectPermission(
    userId: number,
    projectId: string,
    role: ProjectRole,
  ): Promise<boolean> {
    const projectMember = await this.projectMemberRepository.findOne({
      where: {
        project_id: projectId,
        user_id: userId,
      },
    });

    if (!projectMember) {
      return false;
    }

    return projectMember.role === role;
  }
}
