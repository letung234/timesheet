import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Position } from '../entities/position.entity';
import { User } from '../../users/entities/user.entity';
import { CreatePositionDto } from '../dto/create-position.dto';
import { UpdatePositionDto } from '../dto/update-position.dto';
import { ERROR_MESSAGES } from '~/common/constants/error_messages';

@Injectable()
export class PositionService {
  constructor(
    @InjectRepository(Position)
    private positionRepository: Repository<Position>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(
    userId: number,
    createPositionDto: CreatePositionDto,
  ): Promise<Position> {
    // Check if position name already exists
    const existingPosition = await this.positionRepository.findOne({
      where: { name: createPositionDto.name },
    });

    if (existingPosition) {
      throw new ConflictException(ERROR_MESSAGES.POSITION_NAME_ALREADY_EXISTS);
    }

    const position = this.positionRepository.create({
      ...createPositionDto,
      created_by: userId,
    });

    return this.positionRepository.save(position);
  }

  async findAll(): Promise<Position[]> {
    return this.positionRepository.find({
      where: { isActive: true },
      relations: ['createdBy', 'updatedBy'],
    });
  }

  async findOne(id: number): Promise<Position> {
    const position = await this.positionRepository.findOne({
      where: { id },
      relations: ['createdBy', 'updatedBy'],
    });

    if (!position) {
      throw new NotFoundException(ERROR_MESSAGES.POSITION_NOT_FOUND);
    }

    return position;
  }

  async update(
    userId: number,
    id: number,
    updatePositionDto: UpdatePositionDto,
  ): Promise<Position> {
    const position = await this.findOne(id);

    // Check if new name already exists
    if (updatePositionDto.name && updatePositionDto.name !== position.name) {
      const existingPosition = await this.positionRepository.findOne({
        where: { name: updatePositionDto.name },
      });

      if (existingPosition) {
        throw new ConflictException(
          ERROR_MESSAGES.POSITION_NAME_ALREADY_EXISTS,
        );
      }
    }

    Object.assign(position, {
      ...updatePositionDto,
      updated_by: userId,
    });

    return this.positionRepository.save(position);
  }

  async remove(userId: number, id: number): Promise<void> {
    const position = await this.findOne(id);

    // Check if position is being used by any users
    const usersWithPosition = await this.userRepository.count({
      where: { position_id: id },
    });

    if (usersWithPosition > 0) {
      throw new BadRequestException(ERROR_MESSAGES.POSITION_IN_USE);
    }

    position.isActive = false;
    position.updated_by = userId;
    await this.positionRepository.save(position);
  }
}
