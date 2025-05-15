import { Permission } from '../enums/permissions.enum';

export class UserResponseDto {
  id: number;
  email: string;
  fullname: string;
  permissions: string[];
}

export class AuthResponseDto {
  accessToken: string;
  refreshToken: string;
  user: UserResponseDto;
}
