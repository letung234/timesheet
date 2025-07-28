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
import { TypeToken } from './enums/typetoken.enum';
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
  }

  async login(loginDto: LoginDto): Promise<AuthResponseDto> {
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
  }

  async refreshToken(
    refreshTokenDto: RefreshTokenDto,
  ): Promise<AuthResponseDto> {
      const payload = await this.jwtService.verifyAsync(
        refreshTokenDto.refreshToken,
        {
          secret: this.configService.get<string>('jwt.secretRefreshToken'),
        },
      );

      if (payload.type !== TypeToken.REFRESH) {
        throw new BadRequestException(ERROR_MESSAGES.INVALID_TOKEN);
      }

      const user = await this.usersService.findById(payload.sub);
      if (!user) {
        throw new UnauthorizedException(ERROR_MESSAGES.USER_NOT_FOUND);
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
  }

  async logout(refreshToken: string): Promise<void> {
      const payload = await this.jwtService.verifyAsync(refreshToken, {
        secret: this.configService.get<string>('jwt.secretRefreshToken'),
      });

      if (payload.type !== TypeToken.REFRESH) {
        throw new BadRequestException(ERROR_MESSAGES.INVALID_TOKEN);
      }

      const user = await this.usersService.findById(payload.sub);
      if (!user) {
        throw new UnauthorizedException(ERROR_MESSAGES.USER_NOT_FOUND);
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
  }

  async changePassword(
    userId: number,
    oldPassword: string,
    newPassword: string,
  ): Promise<void> {
      const user = await this.usersService.findById(userId);
      if (!user) {
        throw new UnauthorizedException(ERROR_MESSAGES.USER_NOT_FOUND);
      }

      const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
      if (!isPasswordValid) {
        throw new UnauthorizedException(
          ERROR_MESSAGES.IS_CURRENT_PASSWORD_WRONG,
        );
      }

      const hashedPassword = await bcrypt.hash(
        newPassword,
        this.PASSWORD_SALT_ROUNDS,
      );
      await this.usersService.updatePassword(userId, hashedPassword);
  }

  private async generateAccessToken(
    user: Omit<User, 'password'>,
  ): Promise<string> {
    const payload: UserResponseDto = {
      type: TypeToken.ACCESS,
      id: user.id,
      email: user.email,
      fullname: user.fullname,
      permissions: await this.permissionService.getPermissionsNameByUserId(
        user.id,
      ),
    };
    return this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('jwt.secret'),
      expiresIn: this.configService.get<string>('jwt.expiresIn'),
    });
  }

  private async generateRefreshToken(
    user: Omit<User, 'password'>,
  ): Promise<string> {
    const payload = {
      sub: user.id,
      type: TypeToken.REFRESH,
    };

    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('jwt.secretRefreshToken'),
      expiresIn: this.configService.get<string>('jwt.expiresInRefreshToken'),
    });

    await this.refreshTokenService.createRefreshToken(user.id, refreshToken);
    return refreshToken;
  }

  private async mapUserToResponse(
    user: Omit<User, 'password'>,
  ): Promise<UserResponseDto> {
    return {
      id: user.id,
      email: user.email,
      fullname: user.fullname,
      permissions: await this.permissionService.getPermissionsNameByUserId(
        user.id,
      ),
      type: TypeToken.ACCESS,
    };
  }
}
