import { IsString, IsOptional } from 'class-validator';

export class UpdateLevelDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;
}
