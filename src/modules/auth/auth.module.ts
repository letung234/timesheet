import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { RefreshTokenModule } from '../refresh-token/refresh-token.module';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';
import { RbacModule } from '../rbac/rbac.module';
@Module({
  imports: [
    UsersModule,
    RefreshTokenModule,
    PassportModule,
    RbacModule,
    JwtModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, LocalStrategy, JwtModule],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}
