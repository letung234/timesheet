import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
  Request,
  HttpStatus,
} from '@nestjs/common';
import { TimesheetService } from '../services/timesheet.service';
import { CreateTimesheetDto } from '../dto/create-timesheet.dto';
import { UpdateTimesheetDto } from '../dto/update-timesheet.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../auth/guards/permissions.guard';
import { RequirePermissions } from '../../auth/decorators/require-permissions.decorator';
import { Permission } from '../../auth/enums/permissions.enum';

@Controller('timesheet')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class TimesheetController {
  constructor(private readonly timesheetService: TimesheetService) {}

  @Post()
  @RequirePermissions(Permission.CREATE_TIMESHEET)
  async create(@Request() req, @Body() createTimesheetDto: CreateTimesheetDto) {
    const data = await this.timesheetService.create(
      req.user.id,
      createTimesheetDto,
    );
    return {
      message: 'Create timesheet successfully',
      data,
      statusCode: HttpStatus.OK,
    };
  }

  @Get()
  @RequirePermissions(Permission.READ_TIMESHEET)
  async findAll(@Request() req) {
    const data = await this.timesheetService.findAll(req.user.id);
    return {
      message: 'Get timesheets successfully',
      data,
      statusCode: HttpStatus.OK,
    };
  }

  @Get('project/:projectId')
  @RequirePermissions(Permission.VIEW_PROJECT_TIMESHEETS)
  async getProjectTimesheets(@Request() req, @Param('projectId') projectId: string) {
    const data = await this.timesheetService.getProjectTimesheets(req.user.id, projectId);
    return {
      message: 'Get project timesheets successfully',
      data,
      statusCode: HttpStatus.OK,
    };
  }

  @Get('task/:taskId')
  @RequirePermissions(Permission.READ_TIMESHEET)
  async getTaskTimesheets(@Request() req, @Param('taskId') taskId: string) {
    const data = await this.timesheetService.getTaskTimesheets(
      req.user.id,
      parseInt(taskId),
    );
    return {
      message: 'Get task timesheets successfully',
      data,
      statusCode: HttpStatus.OK,
    };
  }

  @Get(':id')
  @RequirePermissions(Permission.READ_TIMESHEET)
  async findOne(@Request() req, @Param('id') id: string) {
    const data = await this.timesheetService.findOne(parseInt(id), req.user.id);
    return {
      message: 'Get timesheet successfully',
      data,
      statusCode: HttpStatus.OK,
    };
  }

  @Patch(':id')
  @RequirePermissions(Permission.UPDATE_TIMESHEET)
  async updateDaily(
    @Request() req,
    @Param('id') id: string,
    @Body() updateTimesheetDto: UpdateTimesheetDto,
  ) {
    const data = await this.timesheetService.updateDaily(
      parseInt(id),
      req.user.id,
      updateTimesheetDto,
    );
    return {
      message: 'Update timesheet successfully',
      data,
      statusCode: HttpStatus.OK,
    };
  }

  @Post(':id/check-in')
  @RequirePermissions(Permission.UPDATE_TIMESHEET)
  async checkIn(@Request() req, @Param('id') id: string) {
    await this.timesheetService.checkIn(parseInt(id), req.user.id);
    return {
      message: 'Check in timesheet successfully',
      statusCode: HttpStatus.OK,
    };
  }

  @Post(':id/check-out')
  @RequirePermissions(Permission.UPDATE_TIMESHEET)
  async checkOut(@Request() req, @Param('id') id: string) {
    await this.timesheetService.checkOut(parseInt(id), req.user.id);
    return {
      message: 'Check out timesheet successfully',
      statusCode: HttpStatus.OK,
    };
  }

  @Post(':id/submit')
  @RequirePermissions(Permission.SUBMIT_TIMESHEET)
  async submit(@Request() req, @Param('id') id: string) {
    await this.timesheetService.submit(parseInt(id), req.user.id);
    return {
      message: 'Submit timesheet successfully',
      statusCode: HttpStatus.OK,
    };
  }

  @Post(':id/approve')
  @RequirePermissions(Permission.APPROVE_TIMESHEET)
  async approve(@Request() req, @Param('id') id: string) {
    await this.timesheetService.approve(parseInt(id), req.user.id);
    return {
      message: 'Approve timesheet successfully',
      statusCode: HttpStatus.OK,
    };
  }

  @Post(':id/reject')
  @RequirePermissions(Permission.REJECT_TIMESHEET)
  async reject(
    @Request() req,
    @Param('id') id: string,
    @Body('reason') reason: string,
  ) {
    await this.timesheetService.reject(parseInt(id), req.user.id, reason);
    return {
      message: 'Reject timesheet successfully',
      statusCode: HttpStatus.OK,
    };
  }

  // Complaint endpoints
  @Post(':id/complaint')
  @RequirePermissions(Permission.CREATE_TIMESHEET)
  async createComplaint(
    @Request() req,
    @Param('id') id: string,
    @Body('content') content: string,
  ) {
    await this.timesheetService.createComplaint(
      parseInt(id),
      req.user.id,
      content,
    );
    return {
      message: 'Create complaint successfully',
      statusCode: HttpStatus.OK,
    };
  }

  @Post(':id/complaint/reply')
  @RequirePermissions(Permission.UPDATE_TIMESHEET)
  async replyComplaint(
    @Request() req,
    @Param('id') id: string,
    @Body('content') content: string,
  ) {
    await this.timesheetService.replyComplaint(
      parseInt(id),
      req.user.id,
      content,
    );
    return {
      message: 'Reply complaint successfully',
      statusCode: HttpStatus.OK,
    };
  }

  @Get('complaints')
  @RequirePermissions(Permission.READ_TIMESHEET)
  async getComplaints(@Request() req) {
    const data = await this.timesheetService.getComplaints(req.user.id);
    return {
      message: 'Get complaints successfully',
      data,
      statusCode: HttpStatus.OK,
    };
  }

  @Get(':id/complaint')
  @RequirePermissions(Permission.READ_TIMESHEET)
  async getComplaint(@Request() req, @Param('id') id: string) {
    const data = await this.timesheetService.getComplaint(
      parseInt(id),
      req.user.id,
    );
    return {
      message: 'Get complaint successfully',
      data,
      statusCode: HttpStatus.OK,
    };
  }
}
