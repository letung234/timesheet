import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Level } from '../entities/level.entity';
import { User } from '../../users/entities/user.entity';
import { CreateLevelDto } from '../dto/create-level.dto';
import { UpdateLevelDto } from '../dto/update-level.dto';
import { ERROR_MESSAGES } from '~/common/constants/error_messages';

@Injectable()
export class LevelService {
  constructor(
    @InjectRepository(Level)
    private levelRepository: Repository<Level>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(userId: number, createLevelDto: CreateLevelDto): Promise<Level> {
    // Check if level name already exists
    const existingLevel = await this.levelRepository.findOne({
      where: { name: createLevelDto.name },
    });

    if (existingLevel) {
      throw new ConflictException(ERROR_MESSAGES.LEVEL_NAME_ALREADY_EXISTS);
    }

    const level = this.levelRepository.create({
      ...createLevelDto,
      created_by: userId,
    });

    return this.levelRepository.save(level);
  }

  async findAll(): Promise<Level[]> {
    return this.levelRepository.find({
      where: { isActive: true },
      relations: ['createdBy', 'updatedBy'],
    });
  }

  async findOne(id: number): Promise<Level> {
    const level = await this.levelRepository.findOne({
      where: { id },
      relations: ['createdBy', 'updatedBy'],
    });

    if (!level) {
      throw new NotFoundException(ERROR_MESSAGES.LEVEL_NOT_FOUND);
    }

    return level;
  }

  async update(
    userId: number,
    id: number,
    updateLevelDto: UpdateLevelDto,
  ): Promise<Level> {
    const level = await this.findOne(id);

    // Check if new name already exists
    if (updateLevelDto.name && updateLevelDto.name !== level.name) {
      const existingLevel = await this.levelRepository.findOne({
        where: { name: updateLevelDto.name },
      });

      if (existingLevel) {
        throw new ConflictException(ERROR_MESSAGES.LEVEL_NAME_ALREADY_EXISTS);
      }
    }

    Object.assign(level, {
      ...updateLevelDto,
      updated_by: userId,
    });

    return this.levelRepository.save(level);
  }

  async remove(userId: number, id: number): Promise<void> {
    const level = await this.findOne(id);

    // Check if level is being used by any users
    const usersWithLevel = await this.userRepository.count({
      where: { level_id: id },
    });

    if (usersWithLevel > 0) {
      throw new BadRequestException(ERROR_MESSAGES.LEVEL_IN_USE);
    }

    level.isActive = false;
    level.updated_by = userId;
    await this.levelRepository.save(level);
  }
}
