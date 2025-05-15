import { IsString, MinLength, Matches, IsNotEmpty } from 'class-validator';
import { Transform } from 'class-transformer';

export class ChangePasswordDto {
  @IsString()
  @IsNotEmpty({ message: 'Current password is required' })
  @Transform(({ value }) => value?.trim())
  oldPassword: string;

  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      'Password must contain at least 1 uppercase letter, 1 lowercase letter, and 1 number or special character',
  })
  @IsNotEmpty({ message: 'New password is required' })
  @Transform(({ value }) => value?.trim())
  newPassword: string;
}
