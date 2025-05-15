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
  create(@Request() req, @Body() createProjectDto: CreateProjectDto) {
    return this.projectService.create(req.user.id, createProjectDto);
  }

  @Get()
  @RequirePermissions(Permission.READ_PROJECT)
  findAll() {
    return this.projectService.findAll();
  }

  @Get(':code')
  @RequirePermissions(Permission.READ_PROJECT)
  findOne(@Param('code') code: string) {
    return this.projectService.findOne(code);
  }

  @Patch(':code')
  @RequirePermissions(Permission.UPDATE_PROJECT)
  update(
    @Request() req,
    @Param('code') code: string,
    @Body() updateProjectDto: UpdateProjectDto,
  ) {
    return this.projectService.update(req.user.id, code, updateProjectDto);
  }

  @Delete(':code')
  @RequirePermissions(Permission.DELETE_PROJECT)
  remove(@Request() req, @Param('code') code: string) {
    return this.projectService.remove(req.user.id, code);
  }

  @Post(':code/members')
  @RequirePermissions(Permission.MANAGE_PROJECT_MEMBERS)
  addMember(
    @Request() req,
    @Param('code') code: string,
    @Body() addMemberDto: AddMemberDto,
  ) {
    return this.projectService.addMember(req.user.id, code, addMemberDto);
  }

  @Delete(':code/members/:userId')
  @RequirePermissions(Permission.MANAGE_PROJECT_MEMBERS)
  removeMember(
    @Request() req,
    @Param('code') code: string,
    @Param('userId') userId: number,
  ) {
    return this.projectService.removeMember(req.user.id, code, userId);
  }

  @Get(':code/members')
  @RequirePermissions(Permission.READ_PROJECT)
  getMembers(@Param('code') code: string) {
    return this.projectService.getMembers(code);
  }

  @Patch(':code/members/:userId/role')
  @RequirePermissions(Permission.MANAGE_PROJECT_MEMBERS)
  updateMemberRole(
    @Request() req,
    @Param('code') code: string,
    @Param('userId') userId: number,
    @Body('role') role: ProjectRole,
  ) {
    return this.projectService.updateMemberRole(
      req.user.id,
      code,
      userId,
      role,
    );
  }
}
