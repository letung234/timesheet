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
    const data = await this.permissionService.create(createPermissionDto);
    return {
      message: 'Create permission successfully',
      data,
      statusCode: HttpStatus.OK,
    };
  }

  @Get()
  @RequirePermissions(Permission.MANAGE_PERMISSIONS)
  async findAll() {
    const data = await this.permissionService.findAll();
    return {
      message: 'Get permissions successfully',
      data,
      statusCode: HttpStatus.OK,
    };
  }

  @Get(':id')
  @RequirePermissions(Permission.MANAGE_PERMISSIONS)
  async findOne(@Param('id') id: string) {
    const data = await this.permissionService.findOne(+id);
    return {
      message: 'Get permission by id successfully',
      data,
      statusCode: HttpStatus.OK,
    };
  }

  @Get('name/:name')
  @RequirePermissions(Permission.MANAGE_PERMISSIONS)
  async findByName(@Param('name') name: string) {
    const data = await this.permissionService.findByName(name);
    return {
      message: 'Get permission by name successfully',
      data,
      statusCode: HttpStatus.OK,
    };
  }

  @Patch(':id')
  @RequirePermissions(Permission.MANAGE_PERMISSIONS)
  async update(
    @Param('id') id: string,
    @Body() updatePermissionDto: UpdatePermissionDto,
  ) {
    const data = await this.permissionService.update(+id, updatePermissionDto);
    return {
      message: 'Update permission successfully',
      data,
      statusCode: HttpStatus.OK,
    };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @RequirePermissions(Permission.MANAGE_PERMISSIONS)
  async remove(@Param('id') id: string) {
    await this.permissionService.remove(+id);
    return {
      message: 'Delete permission successfully',
      statusCode: HttpStatus.OK,
    };
  }

  @Get('role/:roleId')
  @RequirePermissions(Permission.MANAGE_ROLES)
  async getPermissionsByRoleId(@Param('roleId') roleId: string) {
    const data = await this.permissionService.getPermissionsByRoleId(+roleId);
    return {
      message: 'Get permissions by role id successfully',
      data,
      statusCode: HttpStatus.OK,
    };
  }

  @Get('user/:userId')
  @RequirePermissions(Permission.MANAGE_USER_ROLES)
  async getPermissionsByUserId(@Param('userId') userId: string) {
    const data = await this.permissionService.getPermissionsByUserId(+userId);
    return {
      message: 'Get permissions by user id successfully',
      data,
      statusCode: HttpStatus.OK,
    };
  }
}
