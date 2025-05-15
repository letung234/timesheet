import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Permission } from '~/modules/auth/entities/permission.entity';
import { CreatePermissionDto } from '~/modules/rbac/dto/create-permission.dto';
import { UpdatePermissionDto } from '~/modules/rbac/dto/update-permission.dto';
import { ERROR_MESSAGES } from '~/common/constants/error_messages';

@Injectable()
export class PermissionService {
  constructor(
    @InjectRepository(Permission)
    private permissionRepository: Repository<Permission>,
  ) {}

  async create(createPermissionDto: CreatePermissionDto): Promise<Permission> {
    const permission = this.permissionRepository.create(createPermissionDto);
    return this.permissionRepository.save(permission);
  }

  async findAll(): Promise<Permission[]> {
    return this.permissionRepository.find({});
  }

  async findOne(id: number): Promise<Permission> {
    const permission = await this.permissionRepository.findOne({
      where: { id },
    });

    if (!permission) {
      throw new NotFoundException(ERROR_MESSAGES.permissionNotFound);
    }
    return permission;
  }

  async findByName(name: string): Promise<Permission> {
    const permission = await this.permissionRepository.findOne({
      where: { name },
    });

    if (!permission) {
      throw new NotFoundException(ERROR_MESSAGES.permissionNotFound);
    }

    return permission;
  }

  async update(
    id: number,
    updatePermissionDto: UpdatePermissionDto,
  ): Promise<Permission> {
    const permission = await this.findOne(id);
    Object.assign(permission, updatePermissionDto);
    return this.permissionRepository.save(permission);
  }

  async remove(id: number): Promise<void> {
    const permission = await this.findOne(id);
    await this.permissionRepository.remove(permission);
  }

  async getPermissionsByRoleId(roleId: number): Promise<Permission[]> {
    const permissions = await this.permissionRepository
      .createQueryBuilder('permission')
      .innerJoin('permission.rolePermissions', 'rolePermission')
      .innerJoin('rolePermission.role', 'role')
      .where('role.id = :roleId', { roleId })
      .getMany();

    return permissions;
  }

  async getPermissionsNameByUserId(userId: number): Promise<string[]> {
    const permissions = await this.permissionRepository
      .createQueryBuilder('permission')
      .select('permission.name', 'name')
      .innerJoin('permission.rolePermissions', 'rolePermission')
      .innerJoin('rolePermission.role', 'role')
      .innerJoin('role.userRoles', 'userRole')
      .where('userRole.user_id = :userId', { userId })
      .getRawMany();

    return permissions.map((p) => p.name);
  }
  async getPermissionsByUserId(userId: number): Promise<string[]> {
    const permissions = await this.permissionRepository
      .createQueryBuilder('permission')
      .select('permission.name', 'name')
      .innerJoin('permission.rolePermissions', 'rolePermission')
      .innerJoin('rolePermission.role', 'role')
      .innerJoin('role.userRoles', 'userRole')
      .where('userRole.user_id = :userId', { userId })
      .getRawMany();

    return permissions;
  }
}
