import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { user } from '@prisma/client';

@Injectable()
export class TokenService {
  constructor(private jwtService: JwtService) {}

  async getJwtToken(user: user) {
    const payload = { sub: user.id, username: user.userName };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
  
}
