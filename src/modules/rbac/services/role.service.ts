import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from '~/modules/auth/entities/role.entity';
import { Permission } from '~/modules/auth/entities/permission.entity';
import { RolePermission } from '~/modules/auth/entities/role-permission.entity';
import { UserRole } from '~/modules/auth/entities/user-role.entity';
import { CreateRoleDto } from '../dto/create-role.dto';
import { UpdateRoleDto } from '../dto/update-role.dto';
import { AssignPermissionsDto } from '../dto/assign-permissions.dto';
import { ERROR_MESSAGES } from '~/common/constants/error_messages';
import { User } from '~/modules/users/entities/user.entity';
@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
    @InjectRepository(Permission)
    private permissionRepository: Repository<Permission>,
    @InjectRepository(RolePermission)
    private rolePermissionRepository: Repository<RolePermission>,
    @InjectRepository(UserRole)
    private userRoleRepository: Repository<UserRole>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(createRoleDto: CreateRoleDto): Promise<Role> {
    const role = this.roleRepository.create(createRoleDto);
    return this.roleRepository.save(role);
  }

  async findAll(): Promise<Role[]> {
    return this.roleRepository.find({
      relations: ['rolePermissions', 'rolePermissions.permission'],
    });
  }

  async findOne(id: number): Promise<Role> {
    const role = await this.roleRepository.findOne({
      where: { id },
      relations: ['rolePermissions', 'rolePermissions.permission'],
    });

    if (!role) {
      throw new NotFoundException(ERROR_MESSAGES.roleNotFound);
    }

    return role;
  }

  async update(id: number, updateRoleDto: UpdateRoleDto): Promise<Role> {
    const role = await this.findOne(id);
    Object.assign(role, updateRoleDto);
    return this.roleRepository.save(role);
  }

  async remove(id: number): Promise<void> {
    const role = await this.findOne(id);
    await this.roleRepository.remove(role);
  }

  async assignPermissions(
    roleId: number,
    assignPermissionsDto: AssignPermissionsDto,
  ): Promise<Role> {
    const role = await this.findOne(roleId);
    const { permissionIds } = assignPermissionsDto;

    // Remove existing permissions
    await this.rolePermissionRepository.delete({ role: { id: roleId } });

    // Add new permissions
    const permissions =
      await this.permissionRepository.findByIds(permissionIds);
    const rolePermissions = permissions.map((permission) =>
      this.rolePermissionRepository.create({
        role,
        permission,
      }),
    );

    await this.rolePermissionRepository.save(rolePermissions);
    return this.findOne(roleId);
  }

  async getUserRoles(userId: number): Promise<Role[]> {
    const userRoles = await this.userRoleRepository.find({
      where: { user_id: userId },
      relations: [
        'role',
        'role.rolePermissions',
        'role.rolePermissions.permission',
      ],
    });

    return userRoles.map((userRole) => userRole.role);
  }

  async assignRoleToUser(userId: number, roleId: number): Promise<void> {
    const role = await this.findOne(roleId);
    if (!role) {
      throw new NotFoundException(ERROR_MESSAGES.roleNotFound);
    }
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });
    if (!user) {
      throw new NotFoundException(ERROR_MESSAGES.userNotFound);
    }
    const userRole = this.userRoleRepository.create({
      user_id: userId,
      role_id: roleId,
    });
    await this.userRoleRepository.save(userRole);
  }

  async removeRoleFromUser(userId: number, roleId: number): Promise<void> {
    const role = await this.findOne(roleId);
    if (!role) {
      throw new NotFoundException(ERROR_MESSAGES.roleNotFound);
    }
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });
    if (!user) {
      throw new NotFoundException(ERROR_MESSAGES.userNotFound);
    }
    await this.userRoleRepository.delete({
      user_id: userId,
      role_id: roleId,
    });
  }
}
