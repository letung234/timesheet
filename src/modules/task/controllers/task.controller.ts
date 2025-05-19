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
  async create(
    @Request() req,
    @Param('projectCode') projectCode: string,
    @Body() createTaskDto: CreateTaskDto,
  ) {
    const data = await this.taskService.create(req.user.id, {
      ...createTaskDto,
      project_id: projectCode,
    });
    return {
      message: 'Create task successfully',
      data,
      statusCode: HttpStatus.OK,
    };
  }

  @Get()
  @RequirePermissions(Permission.READ_TASK)
  async findAll(@Param('projectCode') projectCode: string) {
    const data = await this.taskService.findAll(projectCode);
    return {
      message: 'Get tasks successfully',
      data,
      statusCode: HttpStatus.OK,
    };
  }

  @Get(':id')
  @RequirePermissions(Permission.READ_TASK)
  async findOne(@Param('id') id: string) {
    const data = await this.taskService.findOne(+id);
    return {
      message: 'Get task successfully',
      data,
      statusCode: HttpStatus.OK,
    };
  }

  @Patch(':id')
  @RequirePermissions(Permission.UPDATE_TASK)
  async update(
    @Request() req,
    @Param('id') id: string,
    @Body() updateTaskDto: UpdateTaskDto,
  ) {
    const data = await this.taskService.update(req.user.id, +id, updateTaskDto);
    return {
      message: 'Update task successfully',
      data,
      statusCode: HttpStatus.OK,
    };
  }

  @Delete(':id')
  @RequirePermissions(Permission.DELETE_TASK)
  async remove(@Request() req, @Param('id') id: string) {
    await this.taskService.remove(req.user.id, +id);
    return {
      message: 'Delete task successfully',
      statusCode: HttpStatus.OK,
    };
  }

  @Post(':id/assign')
  @RequirePermissions(Permission.ASSIGN_TASK)
  async assignTask(
    @Request() req,
    @Param('id') id: string,
    @Body('userId') userId: number,
  ) {
    await this.taskService.assignTask(req.user.id, +id, userId);
    return {
      message: 'Assign task successfully',
      statusCode: HttpStatus.OK,
    };
  }

  @Get('user/:userId')
  @RequirePermissions(Permission.READ_TASK)
  async getUserTasks(@Param('userId') userId: string) {
    const data = await this.taskService.getUserTasks(+userId);
    return {
      message: 'Get user tasks successfully',
      data,
      statusCode: HttpStatus.OK,
    };
  }
}
