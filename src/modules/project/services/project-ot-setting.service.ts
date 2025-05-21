import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProjectOtSetting } from '../entities/project-ot-setting.entity';
import { Project } from '../entities/project.entity';
import { User } from '../../users/entities/user.entity';
import { CreateProjectOtSettingDto } from '../dto/create-project-ot-setting.dto';
import { UpdateProjectOtSettingDto } from '../dto/update-project-ot-setting.dto';
import { ERROR_MESSAGES } from '~/common/constants/error_messages';

@Injectable()
export class ProjectOtSettingService {
  constructor(
    @InjectRepository(ProjectOtSetting)
    private projectOtSettingRepository: Repository<ProjectOtSetting>,
    @InjectRepository(Project)
    private projectRepository: Repository<Project>,
  ) {}

  async create(
    userId: number,
    projectCode: string,
    createProjectOtSettingDto: CreateProjectOtSettingDto,
  ): Promise<ProjectOtSetting> {
    const project = await this.projectRepository.findOne({
      where: { code: projectCode },
    });

    if (!project) {
      throw new NotFoundException(ERROR_MESSAGES.PROJECT_NOT_FOUND);
    }

    const existingSetting = await this.projectOtSettingRepository.findOne({
      where: { project_id: projectCode },
    });

    if (existingSetting) {
      throw new BadRequestException(
        ERROR_MESSAGES.PROJECT_OT_SETTING_ALREADY_EXISTS,
      );
    }

    const setting = this.projectOtSettingRepository.create({
      ...createProjectOtSettingDto,
      project_id: projectCode,
      created_by: userId,
    });

    return this.projectOtSettingRepository.save(setting);
  }

  async findOne(projectCode: string): Promise<ProjectOtSetting> {
    const setting = await this.projectOtSettingRepository.findOne({
      where: { project_id: projectCode },
      relations: ['project', 'createdBy', 'updatedBy'],
    });

    if (!setting) {
      throw new NotFoundException(ERROR_MESSAGES.PROJECT_OT_SETTING_NOT_FOUND);
    }

    return setting;
  }

  async update(
    userId: number,
    projectCode: string,
    updateProjectOtSettingDto: UpdateProjectOtSettingDto,
  ): Promise<ProjectOtSetting> {
    const setting = await this.findOne(projectCode);

    Object.assign(setting, {
      ...updateProjectOtSettingDto,
      updated_by: userId,
    });

    return this.projectOtSettingRepository.save(setting);
  }

  async remove(projectCode: string): Promise<void> {
    const setting = await this.findOne(projectCode);
    await this.projectOtSettingRepository.remove(setting);
  }
}
