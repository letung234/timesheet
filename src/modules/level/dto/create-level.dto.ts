import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class CreateLevelDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;
}
