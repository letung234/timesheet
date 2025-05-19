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
  async create(@Request() req, @Body() createBranchDto: CreateBranchDto) {
    const data = await this.branchService.create(req.user.id, createBranchDto);
    return {
      message: 'Branch created successfully',
      data,
      statusCode: HttpStatus.OK,
    };
  }

  @Get()
  @RequirePermissions(Permission.READ_BRANCH)
  async findAll() {
    const data = await this.branchService.findAll();
    return {
      message: 'Branches retrieved successfully',
      data,
      statusCode: HttpStatus.OK,
    };
  }

  @Get(':id')
  @RequirePermissions(Permission.READ_BRANCH)
  async findOne(@Param('id') id: string) {
    const data = await this.branchService.findOne(+id);
    return {
      message: 'Branch retrieved successfully',
      data,
      statusCode: HttpStatus.OK,
    };
  }

  @Patch(':id')
  @RequirePermissions(Permission.UPDATE_BRANCH)
  async update(
    @Request() req,
    @Param('id') id: string,
    @Body() updateBranchDto: UpdateBranchDto,
  ) {
    const data = await this.branchService.update(
      req.user.id,
      +id,
      updateBranchDto,
    );
    return {
      message: 'Branch updated successfully',
      data,
      statusCode: HttpStatus.OK,
    };
  }

  @Delete(':id')
  @RequirePermissions(Permission.DELETE_BRANCH)
  async remove(@Request() req, @Param('id') id: string) {
    await this.branchService.remove(req.user.id, +id);
    return {
      message: 'Branch deleted successfully',
      statusCode: HttpStatus.OK,
    };
  }
}
