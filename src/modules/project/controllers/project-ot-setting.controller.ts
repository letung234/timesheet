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
  create(
    @Request() req,
    @Param('projectCode') projectCode: string,
    @Body() createProjectOtSettingDto: CreateProjectOtSettingDto,
  ) {
    return this.projectOtSettingService.create(
      req.user.id,
      projectCode,
      createProjectOtSettingDto,
    );
  }

  @Get()
  @RequirePermissions(Permission.READ_PROJECT)
  findOne(@Param('projectCode') projectCode: string) {
    return this.projectOtSettingService.findOne(projectCode);
  }

  @Patch()
  @RequirePermissions(Permission.UPDATE_PROJECT)
  update(
    @Request() req,
    @Param('projectCode') projectCode: string,
    @Body() updateProjectOtSettingDto: UpdateProjectOtSettingDto,
  ) {
    return this.projectOtSettingService.update(
      req.user.id,
      projectCode,
      updateProjectOtSettingDto,
    );
  }

  @Delete()
  @RequirePermissions(Permission.DELETE_PROJECT)
  remove(@Param('projectCode') projectCode: string) {
    return this.projectOtSettingService.remove(projectCode);
  }
}
