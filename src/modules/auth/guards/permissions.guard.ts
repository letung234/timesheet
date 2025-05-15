import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Permission } from '../enums/permissions.enum';
import { ERROR_MESSAGES } from '~/common/constants/error_messages';
import { PERMISSIONS_KEY } from '../decorators/require-permissions.decorator';
@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredPermission = this.reflector.getAllAndOverride<Permission>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredPermission) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();
    if (!user) {
      throw new ForbiddenException(ERROR_MESSAGES.userNotFound);
    }

    const hasPermission = user.permissions.includes(requiredPermission);


    if (!hasPermission) {
      throw new ForbiddenException(ERROR_MESSAGES.insufficientPermissions);
    }

    return true;
  }
}
