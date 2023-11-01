import { Injectable } from '@nestjs/common';
import { authenticator } from 'otplib';
import { PrismaService } from 'src/prisma/prisma.service';
import { ActiveUserData } from '../interfaces/active-user.interface';

@Injectable()
export class OtpAuthService {
  constructor(private prisma: PrismaService) {}

  async generateSecret(username: string) {
    const secret = authenticator.generateSecret();
    const uri = authenticator.keyuri(
      username,
      process.env.TFA_APP_NAME,
      secret,
    );
    return {
      secret,
      uri,
    };
  }

  verifyCode(token: string, secret: string) {
    return authenticator.verify({
      token,
      secret,
    });
  }

  async enable2FA(user: ActiveUserData) {
    const { secret, uri } = await this.generateSecret(user.username);
    await this.prisma.user.update({
      where: { id: user.sub },
      data: { twoFactorAuthEnabled: true, twoFactorAuthSecret: secret },
    });
    return uri;
  }

  async disable2FA(id: string) {
    return this.prisma.user.update({
      where: { id },
      data: { twoFactorAuthEnabled: false, twoFactorAuthSecret: null },
    });
  }
}
