import { IsNumber, IsOptional, Min } from 'class-validator';

export class CreateProjectOtSettingDto {
  @IsNumber()
  @Min(1)
  @IsOptional()
  ot_rate?: number;

  @IsNumber()
  @Min(1)
  @IsOptional()
  holiday_ot_rate?: number;

  @IsNumber()
  @Min(1)
  @IsOptional()
  night_ot_rate?: number;

  @IsNumber()
  @Min(1)
  @IsOptional()
  holiday_night_ot_rate?: number;
}
