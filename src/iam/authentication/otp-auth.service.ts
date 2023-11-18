import { ForbiddenException, Injectable } from '@nestjs/common';
import { authenticator } from 'otplib';
import { PrismaService } from 'src/prisma/prisma.service';
import { ActiveUserData } from '../interfaces/active-user.interface';
import { TokenService } from '../jwt/token.service';
import { OtpVerifyDto } from './dto/otp-verify.dto';
import { User } from 'src/res/users/entities/user.entity';

@Injectable()
export class OtpAuthService {
  constructor(
    private prisma: PrismaService,
    private tokenService: TokenService,
  ) {}

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

  async getCode(user: ActiveUserData) {
    const { secret, uri } = await this.generateSecret(user.username);
    await this.prisma.user.update({
      where: { id: user.sub },
      data: { twoFactorAuthSecret: secret },
    });
    return uri;
  }

  enable2FA(user: ActiveUserData) {
    return this.prisma.user.update({
      where: { id: user.sub },
      data: { twoFactorAuthEnabled: true },
    });
  }

  async disable2FA(id: string) {
    return this.prisma.user.update({
      where: { id },
      data: { twoFactorAuthEnabled: false, twoFactorAuthSecret: null },
    });
  }

  async verify(otpVerifyDto: OtpVerifyDto) {
    const payload = await this.tokenService.verifyToken(otpVerifyDto.token);
    if (!payload)
      throw new ForbiddenException({ message: 'something went wrong' });
    const user: User = await this.prisma.user.findUnique({
      where: { id: payload.sub },
    });
    if (!user)
      throw new ForbiddenException({ message: 'something went wrong' });
    const isValid = this.verifyCode(
      otpVerifyDto.code,
      user.twoFactorAuthSecret,
    );
    if (!isValid) throw new ForbiddenException({ message: 'wrong code' });
    return this.tokenService.getJwtToken(user, true);
  }
}
