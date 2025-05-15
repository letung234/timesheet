import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  IsOptional,
  IsDate,
  IsBoolean,
  IsNumber,
  IsEnum,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Multer } from 'multer';

export class CreateUserDto {
  @IsOptional()
  @IsString()
  avatar?: Express.Multer.File;

  @IsNotEmpty()
  @IsString()
  fullname: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  password: string;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  dob?: Date;

  @IsOptional()
  @IsString()
  sex?: string;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  startDate?: Date;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsNumber()
  salary?: number;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  salaryAt?: Date;

  @IsOptional()
  @IsNumber()
  branch_id?: number;

  @IsOptional()
  @IsNumber()
  level_id?: number;

  @IsOptional()
  @IsNumber()
  position_id?: number;

  @IsOptional()
  @IsString()
  skill?: string;

  @IsOptional()
  @IsNumber()
  remainLeaveDay?: number;

  @IsOptional()
  @IsString()
  bank?: string;

  @IsOptional()
  @IsString()
  bankAccount?: string;

  @IsOptional()
  @IsString()
  taxCode?: string;

  @IsOptional()
  @IsString()
  emergencyContact?: string;

  @IsOptional()
  @IsString()
  emergencyContactPhone?: string;

  @IsOptional()
  @IsString()
  insuranceStatus?: string;

  @IsOptional()
  @IsString()
  identify?: string;

  @IsOptional()
  @IsString()
  placeOfOrigin?: string;

  @IsOptional()
  @IsString()
  placeOfResidence?: string;

  @IsOptional()
  @IsString()
  currentAddress?: string;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  dateOfIssue?: Date;

  @IsOptional()
  @IsString()
  issuedBy?: string;

  @IsOptional()
  @IsNumber()
  trainer_id?: number;

  @IsOptional()
  @IsNumber({}, { each: true })
  role_ids?: number[];
}
