import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  FindUsersOptions,
  FindUsersResult,
} from './interfaces/find-users.interface';
import { UserRole } from '~/modules/auth/entities/user-role.entity';
import { ERROR_MESSAGES } from '~/common/constants/error_messages';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(UserRole)
    private readonly userRoleRepository: Repository<UserRole>,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async create(dto: CreateUserDto): Promise<User> {
    const exists = await this.userRepo.findOne({ where: { email: dto.email } });
    if (exists) throw new ConflictException(ERROR_MESSAGES.emailAlreadyExists);

    const hashed = await bcrypt.hash(dto.password, 10);
    const user = this.userRepo.create({
      ...dto,
      password: hashed,
    });

    if (dto.avatar) {
      const uploadResult = await this.cloudinaryService.uploadFile(dto.avatar);
      user.avatar_url = uploadResult.secure_url;
      user.avatar_public_id = uploadResult.public_id;
    }

    return this.userRepo.save(user);
  }

  async findAll(options: FindUsersOptions): Promise<FindUsersResult> {
    const { page = 1, limit = 10, search } = options;
    const skip = (page - 1) * limit;

    const queryBuilder = this.userRepo.createQueryBuilder('user');

    if (search) {
      queryBuilder.where(
        'user.email LIKE :search OR user.fullname LIKE :search',
        {
          search: `%${search}%`,
        },
      );
    }

    const [users, total] = await queryBuilder
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    return {
      users,
      total,
      page,
      limit,
    };
  }

  async findById(id: number): Promise<User> {
    const user = await this.userRepo.findOne({
      where: { id },
      relations: ['userRoles', 'userRoles.role'],
    });
    if (!user) throw new NotFoundException(ERROR_MESSAGES.userNotFound);
    return user;
  }

  async findByEmail(email: string): Promise<User> {
    const user = await this.userRepo.findOne({
      where: { email },
      relations: ['userRoles', 'userRoles.role'],
    });
    if (!user) throw new NotFoundException(ERROR_MESSAGES.userNotFound);
    return user;
  }

  async update(id: number, dto: UpdateUserDto): Promise<User> {
    const user = await this.findById(id);

    if (dto.email && dto.email !== user.email) {
      const exists = await this.userRepo.findOne({
        where: { email: dto.email },
      });
      if (exists)
        throw new ConflictException(ERROR_MESSAGES.emailAlreadyExists);
    }

    if (dto.avatar) {
      if (user.avatar_public_id) {
        await this.cloudinaryService.deleteFile(user.avatar_public_id);
      }
      const uploadResult = await this.cloudinaryService.uploadFile(dto.avatar);
      user.avatar_url = uploadResult.secure_url;
      user.avatar_public_id = uploadResult.public_id;
    }

    Object.assign(user, dto);
    return this.userRepo.save(user);
  }

  async remove(id: number): Promise<void> {
    const user = await this.findById(id);
    if (user.avatar_public_id) {
      await this.cloudinaryService.deleteFile(user.avatar_public_id);
    }
    await this.userRepo.softRemove(user);
  }


  async updatePassword(userId: number, hashedPassword: string): Promise<void> {
    const user = await this.findById(userId);
    user.password = hashedPassword;
    await this.userRepo.save(user);
  }


  async removeRole(userId: number, roleId: number): Promise<void> {
    const userRole = await this.userRoleRepository.findOne({
      where: { user_id: userId, role_id: roleId },
    });

    if (!userRole) {
      throw new NotFoundException(ERROR_MESSAGES.userNotFound);
    }

    await this.userRoleRepository.remove(userRole);
  }


  async toggleActive(id: number): Promise<User> {
    const user = await this.findById(id);
    user.isActive = !user.isActive;
    return this.userRepo.save(user);
  }

  async uploadAvatar(id: number, file: Express.Multer.File): Promise<User> {
    const user = await this.findById(id);

    if (user.avatar_public_id) {
      await this.cloudinaryService.deleteFile(user.avatar_public_id);
    }

    const uploadResult = await this.cloudinaryService.uploadFile(file);
    user.avatar_url = uploadResult.secure_url;
    user.avatar_public_id = uploadResult.public_id;

    return this.userRepo.save(user);
  }

  async removeAvatar(id: number): Promise<void> {
    const user = await this.findById(id);

    if (user.avatar_public_id) {
      await this.cloudinaryService.deleteFile(user.avatar_public_id);
      user.avatar_url = '';
      user.avatar_public_id = '';
      await this.userRepo.save(user);
    }
  }
}
