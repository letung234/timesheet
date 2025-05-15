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
import { PositionService } from '../services/position.service';
import { CreatePositionDto } from '../dto/create-position.dto';
import { UpdatePositionDto } from '../dto/update-position.dto';

@Controller('positions')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class PositionController {
  constructor(private readonly positionService: PositionService) {}

  @Post()
  @RequirePermissions(Permission.CREATE_POSITION)
  create(@Request() req, @Body() createPositionDto: CreatePositionDto) {
    return this.positionService.create(req.user.id, createPositionDto);
  }

  @Get()
  @RequirePermissions(Permission.READ_POSITION)
  findAll() {
    return this.positionService.findAll();
  }

  @Get(':id')
  @RequirePermissions(Permission.READ_POSITION)
  findOne(@Param('id') id: string) {
    return this.positionService.findOne(+id);
  }

  @Patch(':id')
  @RequirePermissions(Permission.UPDATE_POSITION)
  update(
    @Request() req,
    @Param('id') id: string,
    @Body() updatePositionDto: UpdatePositionDto,
  ) {
    return this.positionService.update(req.user.id, +id, updatePositionDto);
  }

  @Delete(':id')
  @RequirePermissions(Permission.DELETE_POSITION)
  remove(@Request() req, @Param('id') id: string) {
    return this.positionService.remove(req.user.id, +id);
  }
}
