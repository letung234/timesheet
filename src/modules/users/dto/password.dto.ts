import { IsString, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class ChangePasswordDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  userId: number;

  @IsString()
  currentPassword: string;

  @IsString()
  newPassword: string;
}
