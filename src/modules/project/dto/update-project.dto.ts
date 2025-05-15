import { IsString, IsOptional, IsBoolean, IsEnum } from 'class-validator';
import { ProjectStatus } from '../enums/project-status.enum';
import { PartialType } from '@nestjs/mapped-types';
import { CreateProjectDto } from './create-project.dto';

export class UpdateProjectDto extends PartialType(CreateProjectDto) {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsEnum(ProjectStatus)
  @IsOptional()
  status?: ProjectStatus;
}
