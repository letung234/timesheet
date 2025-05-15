import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
  Request,
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
  create(@Request() req, @Body() createTimesheetDto: CreateTimesheetDto) {
    return this.timesheetService.create(req.user.id, createTimesheetDto);
  }

  @Get()
  @RequirePermissions(Permission.READ_TIMESHEET)
  findAll(@Request() req) {
    return this.timesheetService.findAll(req.user.id);
  }

  @Get('project/:projectId')
  @RequirePermissions(Permission.VIEW_PROJECT_TIMESHEETS)
  getProjectTimesheets(@Request() req, @Param('projectId') projectId: string) {
    return this.timesheetService.getProjectTimesheets(req.user.id, projectId);
  }

  @Get('task/:taskId')
  @RequirePermissions(Permission.READ_TIMESHEET)
  getTaskTimesheets(@Request() req, @Param('taskId') taskId: string) {
    return this.timesheetService.getTaskTimesheets(
      req.user.id,
      parseInt(taskId),
    );
  }

  @Get(':id')
  @RequirePermissions(Permission.READ_TIMESHEET)
  findOne(@Request() req, @Param('id') id: string) {
    return this.timesheetService.findOne(parseInt(id), req.user.id);
  }

  @Patch(':id')
  @RequirePermissions(Permission.UPDATE_TIMESHEET)
  updateDaily(
    @Request() req,
    @Param('id') id: string,
    @Body() updateTimesheetDto: UpdateTimesheetDto,
  ) {
    return this.timesheetService.updateDaily(
      parseInt(id),
      req.user.id,
      updateTimesheetDto,
    );
  }

  @Post(':id/check-in')
  @RequirePermissions(Permission.UPDATE_TIMESHEET)
  checkIn(@Request() req, @Param('id') id: string) {
    return this.timesheetService.checkIn(parseInt(id), req.user.id);
  }

  @Post(':id/check-out')
  @RequirePermissions(Permission.UPDATE_TIMESHEET)
  checkOut(@Request() req, @Param('id') id: string) {
    return this.timesheetService.checkOut(parseInt(id), req.user.id);
  }

  @Post(':id/submit')
  @RequirePermissions(Permission.SUBMIT_TIMESHEET)
  submit(@Request() req, @Param('id') id: string) {
    return this.timesheetService.submit(parseInt(id), req.user.id);
  }

  @Post(':id/approve')
  @RequirePermissions(Permission.APPROVE_TIMESHEET)
  approve(@Request() req, @Param('id') id: string) {
    return this.timesheetService.approve(parseInt(id), req.user.id);
  }

  @Post(':id/reject')
  @RequirePermissions(Permission.REJECT_TIMESHEET)
  reject(
    @Request() req,
    @Param('id') id: string,
    @Body('reason') reason: string,
  ) {
    return this.timesheetService.reject(parseInt(id), req.user.id, reason);
  }

  // Complaint endpoints
  @Post(':id/complaint')
  @RequirePermissions(Permission.CREATE_TIMESHEET)
  createComplaint(
    @Request() req,
    @Param('id') id: string,
    @Body('content') content: string,
  ) {
    return this.timesheetService.createComplaint(
      parseInt(id),
      req.user.id,
      content,
    );
  }

  @Post(':id/complaint/reply')
  @RequirePermissions(Permission.UPDATE_TIMESHEET)
  replyComplaint(
    @Request() req,
    @Param('id') id: string,
    @Body('content') content: string,
  ) {
    return this.timesheetService.replyComplaint(
      parseInt(id),
      req.user.id,
      content,
    );
  }

  @Get('complaints')
  @RequirePermissions(Permission.READ_TIMESHEET)
  getComplaints(@Request() req) {
    return this.timesheetService.getComplaints(req.user.id);
  }

  @Get(':id/complaint')
  @RequirePermissions(Permission.READ_TIMESHEET)
  getComplaint(@Request() req, @Param('id') id: string) {
    return this.timesheetService.getComplaint(parseInt(id), req.user.id);
  }
}
