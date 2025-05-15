import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsOptional,
  IsDateString,
  IsDate,
  Matches,
} from 'class-validator';

export class CreateTimesheetDto {
  @IsNotEmpty()
  @IsDateString()
  date: string;

  @IsOptional()
  @Matches(/^([0-1]\d|2[0-3]):([0-5]\d)$/, {
    message: 'check_in must be in HH:mm format',
  })
  check_in?: string;

  @IsOptional()
  @Matches(/^([0-1]\d|2[0-3]):([0-5]\d)$/, {
    message: 'check_out must be in HH:mm format',
  })
  check_out?: string;

  @IsNotEmpty()
  @IsNumber()
  tracker_time?: number;

  @IsOptional()
  @IsString()
  task_id?: string;

  @IsNotEmpty()
  @IsString()
  project_code: string;

  @IsOptional()
  @IsNumber()
  punishment_money?: number;

  @IsOptional()
  @IsString()
  complain?: string;

  @IsOptional()
  @IsString()
  note?: string;
}
