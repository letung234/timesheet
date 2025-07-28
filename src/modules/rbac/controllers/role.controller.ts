import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { RoleService } from '../services/role.service';
import { CreateRoleDto } from '../dto/create-role.dto';
import { UpdateRoleDto } from '../dto/update-role.dto';
import { AssignPermissionsDto } from '../dto/assign-permissions.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RequirePermissions } from '~/modules/auth/decorators/require-permissions.decorator';
import { Permission } from '../../auth/enums/permissions.enum';

@Controller('roles')
@UseGuards(JwtAuthGuard)
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Post()
  @RequirePermissions(Permission.MANAGE_ROLES)
  async create(@Body() createRoleDto: CreateRoleDto) {
    const data = await this.roleService.create(createRoleDto);
    return {
      message: 'Create role successfully',
      data,
      statusCode: HttpStatus.OK,
    };
  }

  @Get()
  @RequirePermissions(Permission.MANAGE_ROLES)
  async findAll() {
    const data = await this.roleService.findAll();
    return {
      message: 'Get roles successfully',
      data,
      statusCode: HttpStatus.OK,
    };
  }

  @Get(':id')
  @RequirePermissions(Permission.MANAGE_ROLES)
  async findOne(@Param('id') id: string) {
    const data = await this.roleService.findOne(+id);
    return {
      message: 'Get role by id successfully',
      data,
      statusCode: HttpStatus.OK,
    };
  }

  @Patch(':id')
  @RequirePermissions(Permission.MANAGE_ROLES)
  async update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
    const data = await this.roleService.update(+id, updateRoleDto);
    return {
      message: 'Update role successfully',
      data,
      statusCode: HttpStatus.OK,
    };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @RequirePermissions(Permission.MANAGE_ROLES)
  async remove(@Param('id') id: string) {
    await this.roleService.remove(+id);
    return {
      message: 'Delete role successfully',
      statusCode: HttpStatus.OK,
    };
  }

  @Post(':id/permissions')
  @RequirePermissions(Permission.MANAGE_ROLES)
  async assignPermissions(
    @Param('id') id: string,
    @Body() assignPermissionsDto: AssignPermissionsDto,
  ) {
    await this.roleService.assignPermissions(+id, assignPermissionsDto);
    return {
      message: 'Assign permissions to role successfully',
      statusCode: HttpStatus.OK,
    };
  }

  @Get('user/:userId')
  @RequirePermissions(Permission.MANAGE_USER_ROLES)
  async getUserRoles(@Param('userId') userId: string) {
    const data = await this.roleService.getUserRoles(+userId);
    return {
      message: 'Get user roles successfully',
      data,
      statusCode: HttpStatus.OK,
    };
  }

  @Post('user/:userId/role/:roleId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @RequirePermissions(Permission.MANAGE_USER_ROLES)
  async assignRoleToUser(
    @Param('userId') userId: string,
    @Param('roleId') roleId: string,
  ) {
    await this.roleService.assignRoleToUser(+userId, +roleId);
    return {
      message: 'Assign role to user successfully',
      statusCode: HttpStatus.OK,
    };
  }

  @Delete('user/:userId/role/:roleId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @RequirePermissions(Permission.MANAGE_USER_ROLES)
  async removeRoleFromUser(
    @Param('userId') userId: string,
    @Param('roleId') roleId: string,
  ) {
    await this.roleService.removeRoleFromUser(+userId, +roleId);
    return {
      message: 'Remove role from user successfully',
      statusCode: HttpStatus.OK,
    };
  }
}
