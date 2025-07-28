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
import { ProjectService } from '../services/project.service';
import { CreateProjectDto } from '../dto/create-project.dto';
import { UpdateProjectDto } from '../dto/update-project.dto';
import { AddMemberDto } from '../dto/add-member.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../auth/guards/permissions.guard';
import { RequirePermissions } from '../../auth/decorators/require-permissions.decorator';
import { Permission } from '../../auth/enums/permissions.enum';
import { ProjectRole } from '../enums/project-role.enum';

@Controller('projects')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Post()
  @RequirePermissions(Permission.CREATE_PROJECT)
  async create(@Request() req, @Body() createProjectDto: CreateProjectDto) {
    const data = await this.projectService.create(req.user.id, createProjectDto);
    return {
      message: 'Project created successfully',
      data,
      statusCode: HttpStatus.OK,
    };
  }

  @Get()
  @RequirePermissions(Permission.READ_PROJECT)
  async findAll() {
    const data = await this.projectService.findAll();
    return {
      message: 'Projects retrieved successfully',
      data,
      statusCode: HttpStatus.OK,
    };
  }

  @Get(':code')
  @RequirePermissions(Permission.READ_PROJECT)
  async findOne(@Param('code') code: string) {
    const data = await this.projectService.findOne(code);
    return {
      message: 'Project retrieved successfully',
      data,
      statusCode: HttpStatus.OK,
    };
  }

  @Patch(':code')
  @RequirePermissions(Permission.UPDATE_PROJECT)
  async update(
    @Request() req,
    @Param('code') code: string,
    @Body() updateProjectDto: UpdateProjectDto,
  ) {
    const data = await this.projectService.update(req.user.id, code, updateProjectDto);
    return {
      message: 'Project updated successfully',
      data,
      statusCode: HttpStatus.OK,
    };
  }

  @Delete(':code')
  @RequirePermissions(Permission.DELETE_PROJECT)
  async remove(@Request() req, @Param('code') code: string) {
    await this.projectService.remove(req.user.id, code);
    return {
      message: 'Project deleted successfully',
      statusCode: HttpStatus.OK,
    };
  }

  @Post(':code/members')
  @RequirePermissions(Permission.MANAGE_PROJECT_MEMBERS)
  async addMember(
    @Request() req,
    @Param('code') code: string,
    @Body() addMemberDto: AddMemberDto,
  ) {
    const data = await this.projectService.addMember(req.user.id, code, addMemberDto);
    return {
      message: 'Member added successfully',
      data,
      statusCode: HttpStatus.OK,
    };
  }

  @Delete(':code/members/:userId')
  @RequirePermissions(Permission.MANAGE_PROJECT_MEMBERS)
  async removeMember(
    @Request() req,
    @Param('code') code: string,
    @Param('userId') userId: number,
  ) {
    await this.projectService.removeMember(req.user.id, code, userId);
    return {
      message: 'Member removed successfully',
      statusCode: HttpStatus.OK,
    };
  }

  @Get(':code/members')
  @RequirePermissions(Permission.READ_PROJECT)
  async getMembers(@Param('code') code: string) {
    const data = await this.projectService.getMembers(code);
    return {
      message: 'Members retrieved successfully',
      data,
      statusCode: HttpStatus.OK,
    };
  }

  @Patch(':code/members/:userId/role')
  @RequirePermissions(Permission.MANAGE_PROJECT_MEMBERS)
  async updateMemberRole(
    @Request() req,
    @Param('code') code: string,
    @Param('userId') userId: number,
    @Body('role') role: ProjectRole,
  ) {
    const data = await this.projectService.updateMemberRole(
      req.user.id,
      code,
      userId,
      role,
    );
    return {
      message: 'Member role updated successfully',
      data,
      statusCode: HttpStatus.OK,
    };
  }
}
