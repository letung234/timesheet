import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  Request,
  HttpStatus,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../auth/guards/permissions.guard';
import { RequirePermissions } from '../../auth/decorators/require-permissions.decorator';
import { Permission } from '../../auth/enums/permissions.enum';
import { RequestService } from '../services/request.service';
import { CreateRequestDto } from '../dto/create-request.dto';
import { UpdateRequestDto } from '../dto/update-request.dto';

@Controller('requests')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class RequestController {
  constructor(private readonly requestService: RequestService) {}

  @Post()
  @RequirePermissions(Permission.CREATE_REQUEST)
  async create(@Request() req, @Body() createRequestDto: CreateRequestDto) {
    const data = await this.requestService.create(req.user.id, createRequestDto);
    return {
      message: 'Create request successfully',
      data,
      statusCode: HttpStatus.OK,
    };
  }

  @Get()
  @RequirePermissions(Permission.READ_REQUEST)
  async findAll(
    @Request() req,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    const data = await this.requestService.findAll(req.user.id, startDate, endDate);
    return {
      message: 'Get requests successfully',
      data,
      statusCode: HttpStatus.OK,
    };
  }

  @Get(':id')
  @RequirePermissions(Permission.READ_REQUEST)
  async findOne(@Request() req, @Param('id') id: string) {
    const data = await this.requestService.findOne(+id, req.user.id);
    return {
      message: 'Get request successfully',
      data,
      statusCode: HttpStatus.OK,
    };
  }

  @Patch(':id')
  @RequirePermissions(Permission.UPDATE_REQUEST)
  async update(
    @Request() req,
    @Param('id') id: string,
    @Body() updateRequestDto: UpdateRequestDto,
  ) {
    const data = await this.requestService.update(req.user.id, +id, updateRequestDto);
    return {
      message: 'Update request successfully',
      data,
      statusCode: HttpStatus.OK,
    };
  }

  @Post(':id/approve')
  @RequirePermissions(Permission.APPROVE_REQUEST)
  async approve(@Request() req, @Param('id') id: string) {
    await this.requestService.approve(req.user.id, +id);
    return {
      message: 'Approve request successfully',
      statusCode: HttpStatus.OK,
    };
  }

  @Post(':id/reject')
  @RequirePermissions(Permission.APPROVE_REQUEST)
  async reject(
    @Request() req,
    @Param('id') id: string,
    @Body('reason') reason: string,
  ) {
    await this.requestService.approve(req.user.id, +id, reason);
    return {
      message: 'Approve request successfully',
      statusCode: HttpStatus.OK,
    };
  }

  @Post(':id/cancel')
  @RequirePermissions(Permission.UPDATE_REQUEST)
  async cancel(@Request() req, @Param('id') id: string) {
    await this.requestService.cancel(req.user.id, +id);
    return {
      message: 'Cancel request successfully',
      statusCode: HttpStatus.OK,
    };
  }
}
