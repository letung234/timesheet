import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RefreshToken } from './entities/refresh-token.entity';

@Injectable()
export class RefreshTokenService {
  constructor(
    @InjectRepository(RefreshToken)
    private refreshTokenRepository: Repository<RefreshToken>,
  ) {}

  async createRefreshToken(
    userId: number,
    token: string,
  ): Promise<RefreshToken> {
    const refreshToken = this.refreshTokenRepository.create({
      userId,
      token,
    });
    return this.refreshTokenRepository.save(refreshToken);
  }

  async validateRefreshToken(token: string, userId: number): Promise<boolean> {
    const refreshToken = await this.refreshTokenRepository.findOne({
      where: { token, userId },
    });
    return !!refreshToken;
  }

  async deleteRefreshToken(token: string): Promise<void> {
    await this.refreshTokenRepository.delete({ token });
  }

  async deleteAllByUser(userId: number): Promise<void> {
    await this.refreshTokenRepository.delete({ userId });
  }
}
