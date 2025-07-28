import { IsNotEmpty, IsNumber, IsDateString, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateRefreshTokenDto {
  @IsString()
  @IsNotEmpty()
  @Type(() => String)
  token: string;

  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  user_id: number;

  @IsDateString()
  @IsNotEmpty()
  @Type(() => Date)
  iat: Date;

  @IsDateString()
  @IsNotEmpty()
  @Type(() => Date)
  exp: Date;
}
