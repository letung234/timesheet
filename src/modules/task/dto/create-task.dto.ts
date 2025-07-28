import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsDate,
  IsNumber,
} from 'class-validator';
import { TaskStatus } from '../enums/task-status.enum';
import { TaskPriority } from '../enums/task-priority.enum';

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty()
  code: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(TaskStatus)
  @IsOptional()
  status?: TaskStatus;

  @IsEnum(TaskPriority)
  @IsOptional()
  priority?: TaskPriority;

  @IsDate()
  @IsOptional()
  start_date?: Date;

  @IsDate()
  @IsOptional()
  end_date?: Date;

  @IsString()
  @IsNotEmpty()
  project_id: string;

  @IsNumber()
  @IsOptional()
  assignee_id?: number;
}
