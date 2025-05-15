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
  create(@Request() req, @Body() createLevelDto: CreateLevelDto) {
    return this.levelService.create(req.user.id, createLevelDto);
  }

  @Get()
  @RequirePermissions(Permission.READ_LEVEL)
  findAll() {
    return this.levelService.findAll();
  }

  @Get(':id')
  @RequirePermissions(Permission.READ_LEVEL)
  findOne(@Param('id') id: string) {
    return this.levelService.findOne(+id);
  }

  @Patch(':id')
  @RequirePermissions(Permission.UPDATE_LEVEL)
  update(
    @Request() req,
    @Param('id') id: string,
    @Body() updateLevelDto: UpdateLevelDto,
  ) {
    return this.levelService.update(req.user.id, +id, updateLevelDto);
  }

  @Delete(':id')
  @RequirePermissions(Permission.DELETE_LEVEL)
  remove(@Request() req, @Param('id') id: string) {
    return this.levelService.remove(req.user.id, +id);
  }
}
