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
import { PermissionsGuard } from '../../auth/guards/permissions.guard';
import { RequirePermissions } from '../../auth/decorators/require-permissions.decorator';
import { Permission } from '../../auth/enums/permissions.enum';
import { BranchService } from '../services/branch.service';
import { CreateBranchDto } from '../dto/create-branch.dto';
import { UpdateBranchDto } from '../dto/update-branch.dto';

@Controller('branches')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class BranchController {
  constructor(private readonly branchService: BranchService) {}

  @Post()
  @RequirePermissions(Permission.CREATE_BRANCH)
  create(@Request() req, @Body() createBranchDto: CreateBranchDto) {
    return this.branchService.create(req.user.id, createBranchDto);
  }

  @Get()
  @RequirePermissions(Permission.READ_BRANCH)
  findAll() {
    return this.branchService.findAll();
  }

  @Get(':id')
  @RequirePermissions(Permission.READ_BRANCH)
  findOne(@Param('id') id: string) {
    return this.branchService.findOne(+id);
  }

  @Patch(':id')
  @RequirePermissions(Permission.UPDATE_BRANCH)
  update(
    @Request() req,
    @Param('id') id: string,
    @Body() updateBranchDto: UpdateBranchDto,
  ) {
    return this.branchService.update(req.user.id, +id, updateBranchDto);
  }

  @Delete(':id')
  @RequirePermissions(Permission.DELETE_BRANCH)
  remove(@Request() req, @Param('id') id: string) {
    return this.branchService.remove(req.user.id, +id);
  }
}
