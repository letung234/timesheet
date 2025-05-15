import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  ParseIntPipe,
  UsePipes,
  ValidationPipe,
  HttpStatus,
  HttpException,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  HttpCode,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { GetUserParamsDto } from './dto/params.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RequirePermissions } from '../auth/decorators/require-permissions.decorator';
import { Permission } from '../auth/enums/permissions.enum';
import { multerConfig } from './config/multer.config';
import { PermissionsGuard } from '~/modules/auth/guards/permissions.guard';
import { ERROR_MESSAGES } from '~/common/constants/error_messages';import { FindUsersOptions } from './interfaces/find-users.interface';
import { FindUsersQueryDto } from './dto/query.dto';
@Controller('users')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @RequirePermissions(Permission.CREATE_USER)
  async create(@Body() dto: CreateUserDto) {
    const data = await this.usersService.create(dto);
    return {
      message: 'Create user successfully',
      data,
      statusCode: HttpStatus.CREATED,
    };
  }

  @Get()
  @RequirePermissions(Permission.READ_USER)
  async findAll(@Query() query: FindUsersQueryDto) {
    const data = await this.usersService.findAll(query);
    return {
      message: 'Get user list successfully',
      data,
      statusCode: HttpStatus.OK,
    };
  }

  @Get(':id')
  @RequirePermissions(Permission.READ_USER)
  async findOne(@Param() params: GetUserParamsDto) {
    const data = await this.usersService.findById(params.id);
    if (!data) {
      throw new HttpException(
        { message: ERROR_MESSAGES.userNotFound },
        HttpStatus.NOT_FOUND,
      );
    }
    return {
      message: 'Get user information successfully',
      data,
      statusCode: HttpStatus.OK,
    };
  }

  @Patch(':id')
  @RequirePermissions(Permission.UPDATE_USER)
  async update(@Param() params: GetUserParamsDto, @Body() dto: UpdateUserDto) {
    const data = await this.usersService.update(params.id, dto);
    return {
      message: 'Update user successfully',
      data,
      statusCode: HttpStatus.OK,
    };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @RequirePermissions(Permission.DELETE_USER)
  async remove(@Param() params: GetUserParamsDto) {
    await this.usersService.remove(params.id);
    return {
      message: 'Delete user successfully',
      statusCode: HttpStatus.OK,
    };
  }

  @Post(':id/avatar')
  @RequirePermissions(Permission.UPDATE_USER)
  @UseInterceptors(FileInterceptor('avatar', multerConfig))
  async uploadAvatar(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.usersService.uploadAvatar(+id, file);
  }

  @Delete(':id/avatar')
  @HttpCode(HttpStatus.NO_CONTENT)
  @RequirePermissions(Permission.UPDATE_USER)
  async removeAvatar(@Param('id') id: string) {
    await this.usersService.removeAvatar(+id);
  }

  @Patch(':id/toggle-active')
  @RequirePermissions(Permission.TOGGLE_USER_ACTIVE)
  async toggleActive(@Param('id') id: string) {
    return this.usersService.toggleActive(+id);
  }
}
