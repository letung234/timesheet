import { IsString, IsOptional, IsEmail, IsPhoneNumber } from 'class-validator';

export class CreateCustomerDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  code?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  address?: string;

  @IsPhoneNumber()
  @IsOptional()
  phone?: string;

  @IsEmail()
  @IsOptional()
  email?: string;
}
