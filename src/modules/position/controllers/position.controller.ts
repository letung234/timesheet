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
import { PositionService } from '../services/position.service';
import { CreatePositionDto } from '../dto/create-position.dto';
import { UpdatePositionDto } from '../dto/update-position.dto';

@Controller('positions')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class PositionController {
  constructor(private readonly positionService: PositionService) {}

  @Post()
  @RequirePermissions(Permission.CREATE_POSITION)
  async create(@Request() req, @Body() createPositionDto: CreatePositionDto) {
    const data = await this.positionService.create(req.user.id, createPositionDto);
    return {
      message: 'Position created successfully',
      data,
      statusCode: HttpStatus.OK,
    };
  }

  @Get()
  @RequirePermissions(Permission.READ_POSITION)
  async findAll() {
    const data = await this.positionService.findAll();
    return {
      message: 'Positions retrieved successfully',
      data,
      statusCode: HttpStatus.OK,
    };
  }

  @Get(':id')
  @RequirePermissions(Permission.READ_POSITION)
  async findOne(@Param('id') id: string) {
    const data = await this.positionService.findOne(+id);
    return {
      message: 'Position retrieved successfully',
      data,
      statusCode: HttpStatus.OK,
    };
  }

  @Patch(':id')
  @RequirePermissions(Permission.UPDATE_POSITION)
  async update(
    @Request() req,
    @Param('id') id: string,
    @Body() updatePositionDto: UpdatePositionDto,
  ) {
    const data = await this.positionService.update(req.user.id, +id, updatePositionDto);
    return {
      message: 'Position updated successfully',
      data,
      statusCode: HttpStatus.OK,
    };
  }

  @Delete(':id')
  @RequirePermissions(Permission.DELETE_POSITION)
  async remove(@Request() req, @Param('id') id: string) {
    await this.positionService.remove(req.user.id, +id);
    return {
      message: 'Position deleted successfully',
      statusCode: HttpStatus.OK,
    };
  }
}
