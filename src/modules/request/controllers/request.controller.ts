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
  create(@Request() req, @Body() createRequestDto: CreateRequestDto) {
    return this.requestService.create(req.user.id, createRequestDto);
  }

  @Get()
  @RequirePermissions(Permission.READ_REQUEST)
  findAll(
    @Request() req,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.requestService.findAll(req.user.id, startDate, endDate);
  }

  @Get(':id')
  @RequirePermissions(Permission.READ_REQUEST)
  findOne(@Request() req, @Param('id') id: string) {
    return this.requestService.findOne(+id, req.user.id);
  }

  @Patch(':id')
  @RequirePermissions(Permission.UPDATE_REQUEST)
  update(
    @Request() req,
    @Param('id') id: string,
    @Body() updateRequestDto: UpdateRequestDto,
  ) {
    return this.requestService.update(req.user.id, +id, updateRequestDto);
  }

  @Post(':id/approve')
  @RequirePermissions(Permission.APPROVE_REQUEST)
  approve(@Request() req, @Param('id') id: string) {
    return this.requestService.approve(req.user.id, +id);
  }

  @Post(':id/reject')
  @RequirePermissions(Permission.APPROVE_REQUEST)
  reject(
    @Request() req,
    @Param('id') id: string,
    @Body('reason') reason: string,
  ) {
    return this.requestService.approve(req.user.id, +id, reason);
  }

  @Post(':id/cancel')
  @RequirePermissions(Permission.UPDATE_REQUEST)
  cancel(@Request() req, @Param('id') id: string) {
    return this.requestService.cancel(req.user.id, +id);
  }
}
