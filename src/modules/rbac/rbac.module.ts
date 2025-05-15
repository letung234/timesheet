import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from '~/modules/auth/entities/role.entity';
import { Permission } from '~/modules/auth/entities/permission.entity';
import { RolePermission } from '~/modules/auth/entities/role-permission.entity';
import { UserRole } from '~/modules/auth/entities/user-role.entity';
import { RoleService } from './services/role.service';
import { PermissionService } from './services/permission.service';
import { RoleController } from './controllers/role.controller';
import { PermissionController } from './controllers/permission.controller';
import { User } from '../users/entities/user.entity';
import { RefreshToken } from '../refresh-token/entities/refresh-token.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Role, Permission, RolePermission, UserRole, User, RefreshToken,]),
  ],
  controllers: [RoleController, PermissionController],
  providers: [RoleService, PermissionService],
  exports: [RoleService, PermissionService],
})
export class RbacModule {}
