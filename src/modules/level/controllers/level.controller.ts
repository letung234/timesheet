import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  HttpStatus,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../auth/guards/permissions.guard';
import { RequirePermissions } from '../../auth/decorators/require-permissions.decorator';
import { Permission } from '../../auth/enums/permissions.enum';
import { LevelService } from '../services/level.service';
import { CreateLevelDto } from '../dto/create-level.dto';
import { UpdateLevelDto } from '../dto/update-level.dto';

@Controller('levels')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class LevelController {
  constructor(private readonly levelService: LevelService) {}

  @Post()
  @RequirePermissions(Permission.CREATE_LEVEL)
  async create(@Request() req, @Body() createLevelDto: CreateLevelDto) {
    const data = await this.levelService.create(req.user.id, createLevelDto);
    return {
      message: 'Level created successfully',
      data,
      statusCode: HttpStatus.OK,
    };
  }

  @Get()
  @RequirePermissions(Permission.READ_LEVEL)
  async findAll() {
    const data = await this.levelService.findAll();
    return {
      message: 'Levels retrieved successfully',
      data,
      statusCode: HttpStatus.OK,
    };
  }

  @Get(':id')
  @RequirePermissions(Permission.READ_LEVEL)
  async findOne(@Param('id') id: string) {
    const data = await this.levelService.findOne(+id);
    return {
      message: 'Level retrieved successfully',
      data,
      statusCode: HttpStatus.OK,
    };
  }

  @Patch(':id')
  @RequirePermissions(Permission.UPDATE_LEVEL)
  async update(
    @Request() req,
    @Param('id') id: string,
    @Body() updateLevelDto: UpdateLevelDto,
  ) {
    const data = await this.levelService.update(req.user.id, +id, updateLevelDto);
    return {
      message: 'Level updated successfully',
      data,
      statusCode: HttpStatus.OK,
    };
  }

  @Delete(':id')
  @RequirePermissions(Permission.DELETE_LEVEL)
  async remove(@Request() req, @Param('id') id: string) {
    await this.levelService.remove(req.user.id, +id);
    return {
      message: 'Level deleted successfully',
      statusCode: HttpStatus.OK,
    };
  }
}
