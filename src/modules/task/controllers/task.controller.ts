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
import { TaskService } from '../services/task.service';
import { CreateTaskDto } from '../dto/create-task.dto';
import { UpdateTaskDto } from '../dto/update-task.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../auth/guards/permissions.guard';
import { RequirePermissions } from '../../auth/decorators/require-permissions.decorator';
import { Permission } from '../../auth/enums/permissions.enum';

@Controller('projects/:projectCode/tasks')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  @RequirePermissions(Permission.CREATE_TASK)
  create(
    @Request() req,
    @Param('projectCode') projectCode: string,
    @Body() createTaskDto: CreateTaskDto,
  ) {
    return this.taskService.create(req.user.id, {
      ...createTaskDto,
      project_id: projectCode,
    });
  }

  @Get()
  @RequirePermissions(Permission.READ_TASK)
  findAll(@Param('projectCode') projectCode: string) {
    return this.taskService.findAll(projectCode);
  }

  @Get(':id')
  @RequirePermissions(Permission.READ_TASK)
  findOne(@Param('id') id: string) {
    return this.taskService.findOne(+id);
  }

  @Patch(':id')
  @RequirePermissions(Permission.UPDATE_TASK)
  update(
    @Request() req,
    @Param('id') id: string,
    @Body() updateTaskDto: UpdateTaskDto,
  ) {
    return this.taskService.update(req.user.id, +id, updateTaskDto);
  }

  @Delete(':id')
  @RequirePermissions(Permission.DELETE_TASK)
  remove(@Request() req, @Param('id') id: string) {
    return this.taskService.remove(req.user.id, +id);
  }

  @Post(':id/assign')
  @RequirePermissions(Permission.ASSIGN_TASK)
  assignTask(
    @Request() req,
    @Param('id') id: string,
    @Body('userId') userId: number,
  ) {
    return this.taskService.assignTask(req.user.id, +id, userId);
  }

  @Get('user/:userId')
  @RequirePermissions(Permission.READ_TASK)
  getUserTasks(@Param('userId') userId: string) {
    return this.taskService.getUserTasks(+userId);
  }
}
