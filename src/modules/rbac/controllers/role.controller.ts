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
    return this.roleService.create(createRoleDto);
  }

  @Get()
  @RequirePermissions(Permission.MANAGE_ROLES)
  async findAll() {
    return this.roleService.findAll();
  }

  @Get(':id')
  @RequirePermissions(Permission.MANAGE_ROLES)
  async findOne(@Param('id') id: string) {
    return this.roleService.findOne(+id);
  }

  @Patch(':id')
  @RequirePermissions(Permission.MANAGE_ROLES)
  async update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
    return this.roleService.update(+id, updateRoleDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @RequirePermissions(Permission.MANAGE_ROLES)
  async remove(@Param('id') id: string) {
    await this.roleService.remove(+id);
  }

  @Post(':id/permissions')
  @RequirePermissions(Permission.MANAGE_ROLES)
  async assignPermissions(
    @Param('id') id: string,
    @Body() assignPermissionsDto: AssignPermissionsDto,
  ) {
    return this.roleService.assignPermissions(+id, assignPermissionsDto);
  }

  @Get('user/:userId')
  @RequirePermissions(Permission.MANAGE_USER_ROLES)
  async getUserRoles(@Param('userId') userId: string) {
    return this.roleService.getUserRoles(+userId);
  }

  @Post('user/:userId/role/:roleId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @RequirePermissions(Permission.MANAGE_USER_ROLES)
  async assignRoleToUser(
    @Param('userId') userId: string,
    @Param('roleId') roleId: string,
  ) {
    await this.roleService.assignRoleToUser(+userId, +roleId);
  }

  @Delete('user/:userId/role/:roleId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @RequirePermissions(Permission.MANAGE_USER_ROLES)
  async removeRoleFromUser(
    @Param('userId') userId: string,
    @Param('roleId') roleId: string,
  ) {
    await this.roleService.removeRoleFromUser(+userId, +roleId);
  }
}
