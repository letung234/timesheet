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
import { JwtAuthGuard } from '~/modules/auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '~/modules/auth/guards/permissions.guard';
import { RequirePermissions } from '../../auth/decorators/require-permissions.decorator';
import { Permission } from '../../auth/enums/permissions.enum';
import { OvertimeRecordService } from '../services/overtime-record.service';
import { CreateOvertimeRecordDto } from '../dto/create-overtime-record.dto';
import { UpdateOvertimeRecordDto } from '../dto/update-overtime-record.dto';

@Controller('overtime-records')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class OvertimeRecordController {
  constructor(private readonly overtimeRecordService: OvertimeRecordService) {}

  @Post()
  @RequirePermissions(Permission.CREATE_OVERTIME)
  create(
    @Request() req,
    @Body() createOvertimeRecordDto: CreateOvertimeRecordDto,
  ) {
    return this.overtimeRecordService.create(
      req.user.id,
      createOvertimeRecordDto,
    );
  }

  @Get()
  @RequirePermissions(Permission.READ_OVERTIME)
  findAll(@Request() req) {
    return this.overtimeRecordService.findAll(req.user.id);
  }

  @Get(':id')
  @RequirePermissions(Permission.READ_OVERTIME)
  findOne(@Request() req, @Param('id') id: string) {
    return this.overtimeRecordService.findOne(+id, req.user.id);
  }

  @Patch(':id')
  @RequirePermissions(Permission.UPDATE_OVERTIME)
  update(
    @Request() req,
    @Param('id') id: string,
    @Body() updateOvertimeRecordDto: UpdateOvertimeRecordDto,
  ) {
    return this.overtimeRecordService.update(
      req.user.id,
      +id,
      updateOvertimeRecordDto,
    );
  }

  @Delete(':id')
  @RequirePermissions(Permission.DELETE_OVERTIME)
  remove(@Request() req, @Param('id') id: string) {
    return this.overtimeRecordService.remove(req.user.id, +id);
  }

  @Patch(':id/approve')
  @RequirePermissions(Permission.APPROVE_OVERTIME)
  approve(
    @Request() req,
    @Param('id') id: string,
    @Body('rejectionReason') rejectionReason?: string,
  ) {
    return this.overtimeRecordService.approve(
      req.user.id,
      +id,
      rejectionReason,
    );
  }
}
