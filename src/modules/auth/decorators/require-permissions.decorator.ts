import { SetMetadata } from '@nestjs/common';
import { Permission } from '../enums/permissions.enum';

export const PERMISSIONS_KEY = 'permission';
export const RequirePermissions = (permission: Permission) =>
  SetMetadata(PERMISSIONS_KEY, permission);