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
import { CustomerService } from '../services/customer.service';
import { CreateCustomerDto } from '../dto/create-customer.dto';
import { UpdateCustomerDto } from '../dto/update-customer.dto';

@Controller('customers')
@UseGuards(JwtAuthGuard)
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Post()
  @RequirePermissions(Permission.CREATE_CUSTOMER)
  create(@Request() req, @Body() createCustomerDto: CreateCustomerDto) {
    return this.customerService.create(req.user.id, createCustomerDto);
  }

  @Get()
  @RequirePermissions(Permission.READ_CUSTOMER)
  findAll() {
    return this.customerService.findAll();
  }

  @Get(':id')
  @RequirePermissions(Permission.READ_CUSTOMER)
  findOne(@Param('id') id: string) {
    return this.customerService.findOne(+id);
  }

  @Patch(':id')
  @RequirePermissions(Permission.UPDATE_CUSTOMER)
  update(
    @Request() req,
    @Param('id') id: string,
    @Body() updateCustomerDto: UpdateCustomerDto,
  ) {
    return this.customerService.update(req.user.id, +id, updateCustomerDto);
  }

  @Delete(':id')
  @RequirePermissions(Permission.DELETE_CUSTOMER)
  remove(@Request() req, @Param('id') id: string) {
    return this.customerService.remove(req.user.id, +id);
  }
}
