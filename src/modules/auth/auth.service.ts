import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  ForbiddenException,
  InternalServerErrorException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { AuthResponseDto, UserResponseDto } from './dto/auth-response.dto';
import { RefreshTokenService } from '../refresh-token/refresh-token.service';
import { User } from '../users/entities/user.entity';
import { ERROR_MESSAGES } from '~/common/constants/error_messages';
import { PermissionService } from '../rbac/services/permission.service';
@Injectable()
export class AuthService {
  private readonly MAX_LOGIN_ATTEMPTS = 5;
  private readonly LOGIN_ATTEMPT_WINDOW = 15 * 60 * 1000; // 15 minutes
  private readonly PASSWORD_SALT_ROUNDS = 10;
  private loginAttempts: Map<string, { count: number; timestamp: number }> =
    new Map();

  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private refreshTokenService: RefreshTokenService,
    private permissionService: PermissionService,
  ) {}

  private async checkLoginAttempts(email: string): Promise<void> {
    const attempt = this.loginAttempts.get(email);
    const now = Date.now();

    if (attempt) {
      if (now - attempt.timestamp > this.LOGIN_ATTEMPT_WINDOW) {
        this.loginAttempts.delete(email);
      } else if (attempt.count >= this.MAX_LOGIN_ATTEMPTS) {
        throw new ForbiddenException(ERROR_MESSAGES.TOO_MANY_LOGIN_ATTEMPTS);
      }
    }
  }

  private async incrementLoginAttempts(email: string): Promise<void> {
    const attempt = this.loginAttempts.get(email) || {
      count: 0,
      timestamp: Date.now(),
    };
    attempt.count++;
    this.loginAttempts.set(email, attempt);
  }

  private async resetLoginAttempts(email: string): Promise<void> {
    this.loginAttempts.delete(email);
  }

  async validateUser(
    email: string,
    password: string,
  ): Promise<Omit<User, 'password'> | null> {
    try {
      await this.checkLoginAttempts(email);

      const user = await this.usersService.findByEmail(email);
      if (!user) {
        await this.incrementLoginAttempts(email);
        return null;
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        await this.incrementLoginAttempts(email);
        return null;
      }

      await this.resetLoginAttempts(email);
      const { password: _, ...result } = user;
      return result;
    } catch (error) {
      if (error instanceof ForbiddenException) {
        throw error;
      }
      throw new InternalServerErrorException(
        ERROR_MESSAGES.INVALID_CREDENTIALS,
      );
    }
  }

  async login(loginDto: LoginDto): Promise<AuthResponseDto> {
    try {
      const user = await this.validateUser(loginDto.email, loginDto.password);
      if (!user) {
        throw new UnauthorizedException(ERROR_MESSAGES.INVALID_CREDENTIALS);
      }

      const [accessToken, refreshToken] = await Promise.all([
        this.generateAccessToken(user),
        this.generateRefreshToken(user),
      ]);

      return {
        accessToken,
        refreshToken,
        user: await this.mapUserToResponse(user),
      };
    } catch (error) {
      if (
        error instanceof UnauthorizedException ||
        error instanceof ForbiddenException
      ) {
        throw error;
      }
      throw new InternalServerErrorException(ERROR_MESSAGES.LOGIN_FAILED);
    }
  }

  async refreshToken(
    refreshTokenDto: RefreshTokenDto,
  ): Promise<AuthResponseDto> {
    try {
      const payload = await this.jwtService.verifyAsync(
        refreshTokenDto.refreshToken,
        {
          secret: this.configService.get<string>('jwt.secretRefreshToken'),
        },
      );

      if (payload.type !== 'refresh') {
        throw new BadRequestException(ERROR_MESSAGES.INVALID_TOKEN);
      }

      const user = await this.usersService.findById(payload.sub);
      if (!user) {
        throw new UnauthorizedException(ERROR_MESSAGES.userNotFound);
      }

      const isValid = await this.refreshTokenService.validateRefreshToken(
        refreshTokenDto.refreshToken,
        user.id,
      );

      if (!isValid) {
        throw new UnauthorizedException(ERROR_MESSAGES.INVALID_TOKEN);
      }

      // Invalidate the old refresh token
      const valid = await this.refreshTokenService.validateRefreshToken(
        refreshTokenDto.refreshToken,
        user.id,
      );

      if (!valid) {
        throw new UnauthorizedException(ERROR_MESSAGES.INVALID_TOKEN);
      }
      const [accessToken, refreshToken] = await Promise.all([
        this.generateAccessToken(user),
        this.generateRefreshToken(user),
      ]);

      return {
        accessToken,
        refreshToken,
        user: await this.mapUserToResponse(user),
      };
    } catch (error) {
      if (
        error instanceof UnauthorizedException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new UnauthorizedException(ERROR_MESSAGES.INVALID_TOKEN);
    }
  }

  async logout(refreshToken: string): Promise<void> {
    try {
      const payload = await this.jwtService.verifyAsync(
        refreshToken,
        {
          secret: this.configService.get<string>('jwt.secretRefreshToken'),
        },
      );

      if (payload.type !== 'refresh') {
        throw new BadRequestException(ERROR_MESSAGES.INVALID_TOKEN);
      }

      const user = await this.usersService.findById(payload.sub);
      if (!user) {
        throw new UnauthorizedException(ERROR_MESSAGES.userNotFound);
      }

      const isValid = await this.refreshTokenService.validateRefreshToken(
        refreshToken,
        user.id,
      );

      if (!isValid) {
        throw new UnauthorizedException(ERROR_MESSAGES.INVALID_TOKEN);
      }
      const valid = await this.refreshTokenService.validateRefreshToken(
        refreshToken,
        user.id,
      );

      if (!valid) {
        throw new UnauthorizedException(ERROR_MESSAGES.INVALID_TOKEN);
      }
      await this.refreshTokenService.deleteRefreshToken(refreshToken);
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new InternalServerErrorException(ERROR_MESSAGES.LOGOUT_FAILED);
    }
  }

  async changePassword(
    userId: number,
    oldPassword: string,
    newPassword: string,
  ): Promise<void> {
    try {
      const user = await this.usersService.findById(userId);
      if (!user) {
        throw new UnauthorizedException(ERROR_MESSAGES.userNotFound);
      }

      const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
      if (!isPasswordValid) {
        throw new UnauthorizedException(ERROR_MESSAGES.isCurrentPasswordWrong);
      }

      const hashedPassword = await bcrypt.hash(
        newPassword,
        this.PASSWORD_SALT_ROUNDS,
      );
      await this.usersService.updatePassword(userId, hashedPassword);
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new InternalServerErrorException(ERROR_MESSAGES.CHANGE_PASSWORD_FAILED);
    }
  }

  private async generateAccessToken(user: Omit<User, 'password'>): Promise<string> {
    const payload: UserResponseDto = {
      id: user.id,
      email: user.email,
      fullname: user.fullname,
      permissions: await this.permissionService.getPermissionsNameByUserId(user.id),
    };
    return this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('jwt.secret'),
      expiresIn: this.configService.get<string>('jwt.expiresIn'),
    });
  }

  private async generateRefreshToken(user: Omit<User, 'password'>): Promise<string> {
    const payload = {
      sub: user.id,
      type: 'refresh',
    };

    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('jwt.secretRefreshToken'),
      expiresIn: this.configService.get<string>('jwt.expiresInRefreshToken'),
    });

    await this.refreshTokenService.createRefreshToken(user.id, refreshToken);
    return refreshToken;
  }

  private async mapUserToResponse(user: Omit<User, 'password'>): Promise<UserResponseDto> {
    return {
      id: user.id,
      email: user.email,
      fullname: user.fullname,
      permissions: await this.permissionService.getPermissionsNameByUserId(user.id),
    };
  }
}
