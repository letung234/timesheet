import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Customer } from '../entities/customer.entity';
import { User } from '../../users/entities/user.entity';
import { CreateCustomerDto } from '../dto/create-customer.dto';
import { UpdateCustomerDto } from '../dto/update-customer.dto';
import { ERROR_MESSAGES } from '~/common/constants/error_messages';
import { Project } from '../entities/project.entity';

@Injectable()
export class CustomerService {
  constructor(
    @InjectRepository(Customer)
    private customerRepository: Repository<Customer>,
    @InjectRepository(Project)
    private projectRepository: Repository<Project>,
  ) {}

  async create(
    userId: number,
    createCustomerDto: CreateCustomerDto,
  ): Promise<Customer> {
    const existingCustomer = await this.customerRepository.findOne({
      where: { code: createCustomerDto.code },
    });

    if (existingCustomer) {
      throw new BadRequestException(
        ERROR_MESSAGES.CUSTOMER_CODE_ALREADY_EXISTS,
      );
    }

    const customer = this.customerRepository.create({
      ...createCustomerDto,
      created_by: userId,
    });

    return this.customerRepository.save(customer);
  }

  async findAll(): Promise<Customer[]> {
    return this.customerRepository.find({
      where: { isActive: true },
      relations: ['createdBy', 'updatedBy'],
    });
  }

  async findOne(id: number): Promise<Customer> {
    const customer = await this.customerRepository.findOne({
      where: { id },
      relations: ['createdBy', 'updatedBy', 'projects'],
    });

    if (!customer) {
      throw new NotFoundException(ERROR_MESSAGES.CUSTOMER_NOT_FOUND);
    }

    return customer;
  }

  async update(
    userId: number,
    id: number,
    updateCustomerDto: UpdateCustomerDto,
  ): Promise<Customer> {
    const customer = await this.findOne(id);

    if (updateCustomerDto.code && updateCustomerDto.code !== customer.code) {
      const existingCustomer = await this.customerRepository.findOne({
        where: { code: updateCustomerDto.code },
      });

      if (existingCustomer) {
        throw new BadRequestException(
          ERROR_MESSAGES.CUSTOMER_CODE_ALREADY_EXISTS,
        );
      }
    }

    Object.assign(customer, {
      ...updateCustomerDto,
      updated_by: userId,
    });

    return this.customerRepository.save(customer);
  }

  async remove(userId: number, id: number): Promise<void> {
    const customer = await this.findOne(id);

    // Check if customer is being used in any active projects
    const activeProjects = await this.projectRepository.find({
      where: { customer_id: id, isActive: true },
    });

    if (activeProjects.length > 0) {
      throw new BadRequestException(
        ERROR_MESSAGES.CUSTOMER_IN_USE,
      );
    }

    customer.isActive = false;
    customer.updated_by = userId;
    await this.customerRepository.save(customer);
  }
}
