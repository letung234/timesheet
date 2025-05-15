import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsDate,
  IsNumber,
  Matches,
} from 'class-validator';
import { RequestType } from '../enums/request-type.enum';
import { AbsenceType } from '../enums/absence-type.enum';

export class CreateRequestDto {
  @IsString()
  @IsNotEmpty()
  code: string;

  @IsEnum(RequestType)
  @IsNotEmpty()
  type: RequestType;

  @IsEnum(AbsenceType)
  @IsOptional()
  absence_type?: AbsenceType;

  @IsString()
  @IsNotEmpty()
  reason: string;

  @IsDate()
  @IsNotEmpty()
  start_date: Date;

  @IsDate()
  @IsNotEmpty()
  end_date: Date;

  @IsString()
  @IsOptional()
  @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: 'start_time must be in HH:mm format',
  })
  start_time?: string;

  @IsString()
  @IsOptional()
  @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: 'end_time must be in HH:mm format',
  })
  end_time?: string;

  @IsNumber()
  @IsNotEmpty()
  daily_attendance_id: number;
}
