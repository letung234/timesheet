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
import { CustomerService } from '../services/customer.service';
import { CreateCustomerDto } from '../dto/create-customer.dto';
import { UpdateCustomerDto } from '../dto/update-customer.dto';

@Controller('customers')
@UseGuards(JwtAuthGuard)
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Post()
  @RequirePermissions(Permission.CREATE_CUSTOMER)
  async create(@Request() req, @Body() createCustomerDto: CreateCustomerDto) {
    const data = await this.customerService.create(req.user.id, createCustomerDto);
    return {
      message: 'Create customer successfully',
      data,
      statusCode: HttpStatus.OK,
    };
  }

  @Get()
  @RequirePermissions(Permission.READ_CUSTOMER)
  async findAll() {
    const data = await this.customerService.findAll();
    return {
      message: 'Get customers successfully',
      data,
      statusCode: HttpStatus.OK,
    };
  }

  @Get(':id')
  @RequirePermissions(Permission.READ_CUSTOMER)
  async findOne(@Param('id') id: string) {
    const data = await this.customerService.findOne(+id);
    return {
      message: 'Get customer successfully',
      data,
      statusCode: HttpStatus.OK,
    };
  }

  @Patch(':id')
  @RequirePermissions(Permission.UPDATE_CUSTOMER)
  async update(
    @Request() req,
    @Param('id') id: string,
    @Body() updateCustomerDto: UpdateCustomerDto,
  ) {
    const data = await this.customerService.update(req.user.id, +id, updateCustomerDto);
    return {
      message: 'Update customer successfully',
      data,
      statusCode: HttpStatus.OK,
    };
  }

  @Delete(':id')
  @RequirePermissions(Permission.DELETE_CUSTOMER)
  async remove(@Request() req, @Param('id') id: string) {
    await this.customerService.remove(req.user.id, +id);
    return {
      message: 'Delete customer successfully',
      statusCode: HttpStatus.OK,
    };
  }
}
