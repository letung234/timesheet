import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class CreatePositionDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;
}
