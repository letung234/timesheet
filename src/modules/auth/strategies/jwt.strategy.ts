import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../../users/users.service';
import { UserResponseDto } from '../dto/auth-response.dto';
import { ERROR_MESSAGES } from '~/common/constants/error_messages';
import { PermissionService } from '../../rbac/services/permission.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private usersService: UsersService,
    private permissionService: PermissionService,
  ) {
    const secret = configService.get<string>('jwt.secret');
    if (!secret) {
      throw new Error(ERROR_MESSAGES.jwtSecretNotDefined);
    }

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secret,
    });
  }

  async validate(payload: UserResponseDto): Promise<UserResponseDto> {
    const user = await this.usersService.findById(payload.id);
    if (!user) {
      throw new UnauthorizedException(ERROR_MESSAGES.userNotFound);
    }
    const permissions = await this.permissionService.getPermissionsNameByUserId(user.id);
    return {
      id: user.id,
      email: user.email,
      fullname: user.fullname,
      permissions: permissions,
    };
  }
}
