import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { user } from '@prisma/client';
import { jwtConstants } from './jwtConstants';
import { ProviderUserData } from '../interfaces/provider-data.interface';

@Injectable()
export class TokenService {
  constructor(private jwtService: JwtService) {}

  async getJwtToken(user: user, fullAccess: boolean) {
    const payload = { sub: user.id, username: user.userName, fullAccess };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async getProviderToken(providerUserData: ProviderUserData) {
    return {
      provider_info: await this.jwtService.signAsync(
        { ...providerUserData, fullAccess: false },
        {
          expiresIn: '5m',
        },
      ),
    };
  }

  async verifyToken(token: string) {
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: jwtConstants.secret,
      });
      return payload;
    } catch {
      return null;
    }
  }
}
