import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Branch } from '../entities/branch.entity';
import { User } from '../../users/entities/user.entity';
import { CreateBranchDto } from '../dto/create-branch.dto';
import { UpdateBranchDto } from '../dto/update-branch.dto';
import { ERROR_MESSAGES } from '~/common/constants/error_messages';

@Injectable()
export class BranchService {
  constructor(
    @InjectRepository(Branch)
    private branchRepository: Repository<Branch>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(
    userId: number,
    createBranchDto: CreateBranchDto,
  ): Promise<Branch> {
    // Check if branch name already exists
    const existingBranch = await this.branchRepository.findOne({
      where: { name: createBranchDto.name },
    });

    if (existingBranch) {
      throw new ConflictException(ERROR_MESSAGES.BRANCH_NAME_ALREADY_EXISTS);
    }

    const branch = this.branchRepository.create({
      ...createBranchDto,
      created_by: userId,
    });

    return this.branchRepository.save(branch);
  }

  async findAll(): Promise<Branch[]> {
    return this.branchRepository.find({
      where: { isActive: true },
      relations: ['createdBy', 'updatedBy'],
    });
  }

  async findOne(id: number): Promise<Branch> {
    const branch = await this.branchRepository.findOne({
      where: { id },
      relations: ['createdBy', 'updatedBy'],
    });

    if (!branch) {
      throw new NotFoundException(ERROR_MESSAGES.BRANCH_NOT_FOUND);
    }

    return branch;
  }

  async update(
    userId: number,
    id: number,
    updateBranchDto: UpdateBranchDto,
  ): Promise<Branch> {
    const branch = await this.findOne(id);

    // Check if new name already exists
    if (updateBranchDto.name && updateBranchDto.name !== branch.name) {
      const existingBranch = await this.branchRepository.findOne({
        where: { name: updateBranchDto.name },
      });

      if (existingBranch) {
        throw new ConflictException(ERROR_MESSAGES.BRANCH_NAME_ALREADY_EXISTS);
      }
    }

    Object.assign(branch, {
      ...updateBranchDto,
      updated_by: userId,
    });

    return this.branchRepository.save(branch);
  }

  async remove(userId: number, id: number): Promise<void> {
    const branch = await this.findOne(id);

    // Check if branch is being used by any users
    const usersWithBranch = await this.userRepository.count({
      where: { branch_id: id },
    });

    if (usersWithBranch > 0) {
      throw new BadRequestException(ERROR_MESSAGES.BRANCH_IN_USE);
    }

    branch.isActive = false;
    branch.updated_by = userId;
    await this.branchRepository.save(branch);
  }
}
