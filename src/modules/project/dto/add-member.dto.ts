import { IsNumber, IsEnum, IsNotEmpty } from 'class-validator';
import { ProjectRole } from '../enums/project-role.enum';

export class AddMemberDto {
  @IsNumber()
  @IsNotEmpty()
  userId: number;

  @IsEnum(ProjectRole)
  @IsNotEmpty()
  role: ProjectRole;
}
