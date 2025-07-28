import { IsOptional, IsString, IsBoolean, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class FindUsersQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class RemoveUserQueryDto {
  @IsOptional()
  @IsBoolean()
  soft?: boolean;
}
