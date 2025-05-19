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
  async create(
    @Request() req,
    @Body() createOvertimeRecordDto: CreateOvertimeRecordDto,
  ) {
    const data = await this.overtimeRecordService.create(
      req.user.id,
      createOvertimeRecordDto,
    );
    return {
      message: 'Overtime record created successfully',
      data,
      statusCode: HttpStatus.OK,
    };
  }

  @Get()
  @RequirePermissions(Permission.READ_OVERTIME)
  async findAll(@Request() req) {
    const data = await this.overtimeRecordService.findAll(req.user.id);
    return {
      message: 'Overtime records retrieved successfully',
      data,
      statusCode: HttpStatus.OK,
    };
  }

  @Get(':id')
  @RequirePermissions(Permission.READ_OVERTIME)
  async findOne(@Request() req, @Param('id') id: string) {
    const data = await this.overtimeRecordService.findOne(+id, req.user.id);
    return {
      message: 'Overtime record retrieved successfully',
      data,
      statusCode: HttpStatus.OK,
    };
  }

  @Patch(':id')
  @RequirePermissions(Permission.UPDATE_OVERTIME)
  async update(
    @Request() req,
    @Param('id') id: string,
    @Body() updateOvertimeRecordDto: UpdateOvertimeRecordDto,
  ) {
    const data = await this.overtimeRecordService.update(
      req.user.id,
      +id,
      updateOvertimeRecordDto,
    );
    return {
      message: 'Overtime record updated successfully',
      data,
      statusCode: HttpStatus.OK,
    };
  }

  @Delete(':id')
  @RequirePermissions(Permission.DELETE_OVERTIME)
  async remove(@Request() req, @Param('id') id: string) {
    await this.overtimeRecordService.remove(req.user.id, +id);
    return {
      message: 'Overtime record deleted successfully',
      statusCode: HttpStatus.OK,
    };
  }

  @Patch(':id/approve')
  @RequirePermissions(Permission.APPROVE_OVERTIME)
  async approve(
    @Request() req,
    @Param('id') id: string,
    @Body('rejectionReason') rejectionReason?: string,
  ) {
    const data = await this.overtimeRecordService.approve(
      req.user.id,
      +id,
      rejectionReason,
    );
    return {
      message: 'Overtime record approved successfully',
      data,
      statusCode: HttpStatus.OK,
    };
  }
}
