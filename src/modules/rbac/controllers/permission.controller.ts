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
import { PermissionService } from '../services/permission.service';
import { CreatePermissionDto } from '../dto/create-permission.dto';
import { UpdatePermissionDto } from '../dto/update-permission.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RequirePermissions } from '~/modules/auth/decorators/require-permissions.decorator';
import { Permission } from '../../auth/enums/permissions.enum';

@Controller('permissions')
@UseGuards(JwtAuthGuard)
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  @Post()
  @RequirePermissions(Permission.MANAGE_PERMISSIONS)
  async create(@Body() createPermissionDto: CreatePermissionDto) {
    return this.permissionService.create(createPermissionDto);
  }

  @Get()
  @RequirePermissions(Permission.MANAGE_PERMISSIONS)
  async findAll() {
    return this.permissionService.findAll();
  }

  @Get(':id')
  @RequirePermissions(Permission.MANAGE_PERMISSIONS)
  async findOne(@Param('id') id: string) {
    return this.permissionService.findOne(+id);
  }

  @Get('name/:name')
  @RequirePermissions(Permission.MANAGE_PERMISSIONS)
  async findByName(@Param('name') name: string) {
    return this.permissionService.findByName(name);
  }

  @Patch(':id')
  @RequirePermissions(Permission.MANAGE_PERMISSIONS)
  async update(
    @Param('id') id: string,
    @Body() updatePermissionDto: UpdatePermissionDto,
  ) {
    return this.permissionService.update(+id, updatePermissionDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @RequirePermissions(Permission.MANAGE_PERMISSIONS)
  async remove(@Param('id') id: string) {
    await this.permissionService.remove(+id);
  }

  @Get('role/:roleId')
  @RequirePermissions(Permission.MANAGE_ROLES)
  async getPermissionsByRoleId(@Param('roleId') roleId: string) {
    return this.permissionService.getPermissionsByRoleId(+roleId);
  }

  @Get('user/:userId')
  @RequirePermissions(Permission.MANAGE_USER_ROLES)
  async getPermissionsByUserId(@Param('userId') userId: string) {
    return this.permissionService.getPermissionsByUserId(+userId);
  }
}
