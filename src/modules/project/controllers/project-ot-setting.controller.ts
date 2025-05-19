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
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RequirePermissions } from '../../auth/decorators/require-permissions.decorator';
import { Permission } from '../../auth/enums/permissions.enum';
import { ProjectOtSettingService } from '../services/project-ot-setting.service';
import { CreateProjectOtSettingDto } from '../dto/create-project-ot-setting.dto';
import { UpdateProjectOtSettingDto } from '../dto/update-project-ot-setting.dto';

@Controller('projects/:projectCode/ot-settings')
@UseGuards(JwtAuthGuard)
export class ProjectOtSettingController {
  constructor(
    private readonly projectOtSettingService: ProjectOtSettingService,
  ) {}

  @Post()
  @RequirePermissions(Permission.CREATE_PROJECT)
  async create(
    @Request() req,
    @Param('projectCode') projectCode: string,
    @Body() createProjectOtSettingDto: CreateProjectOtSettingDto,
  ) {
    const data = await this.projectOtSettingService.create(
      req.user.id,
      projectCode,
      createProjectOtSettingDto,
    );
    return {
      message: 'Project OT setting created successfully',
      data,
      statusCode: HttpStatus.OK,
    };
  }

  @Get()
  @RequirePermissions(Permission.READ_PROJECT)
  async findOne(@Param('projectCode') projectCode: string) {
    const data = await this.projectOtSettingService.findOne(projectCode);
    return {
      message: 'Project OT setting retrieved successfully',
      data,
      statusCode: HttpStatus.OK,
    };
  }

  @Patch()
  @RequirePermissions(Permission.UPDATE_PROJECT)
  async update(
    @Request() req,
    @Param('projectCode') projectCode: string,
    @Body() updateProjectOtSettingDto: UpdateProjectOtSettingDto,
  ) {
    const data = await this.projectOtSettingService.update(
      req.user.id,
      projectCode,
      updateProjectOtSettingDto,
    );
    return {
      message: 'Project OT setting updated successfully',
      data,
      statusCode: HttpStatus.OK,
    };
  }

  @Delete()
  @RequirePermissions(Permission.DELETE_PROJECT)
  async remove(@Param('projectCode') projectCode: string) {
    await this.projectOtSettingService.remove(projectCode);
    return {
      message: 'Project OT setting deleted successfully',
      statusCode: HttpStatus.OK,
    };
  }
}
