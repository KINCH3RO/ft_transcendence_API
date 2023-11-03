import { ForbiddenException, Injectable } from '@nestjs/common';
import { UsersService } from 'src/res/users/users.service';
import { TokenService } from 'src/iam/jwt/token.service';
import { ProviderUserData } from 'src/iam/interfaces/provider-data.interface';
import { provider } from '@prisma/client';
import * as randomstring from 'randomstring';

@Injectable()
export class ProviderAuthenticationService {
  jwtService: any;
  constructor(
    private userService: UsersService,
    private tokenService: TokenService,
  ) {}
  async signIn(providerUserData: ProviderUserData) {
    const user = await this.userService.findByProviderId(
      providerUserData.id,
      providerUserData.providerType,
    );
    if (!user)
      return {
        access_token: null,
        ...(await this.tokenService.getProviderToken(providerUserData)),
        twoFactorAuth: false,
      };
    else {
      return {
        ...(await this.tokenService.getJwtToken(
          user,
          !user.twoFactorAuthEnabled,
        )),
        provider_info: null,
        twoFactorAuth: user.twoFactorAuthEnabled,
      };
    }
  }

  generateUsername(username: string) {
    return username + randomstring.generate({ length: 2, charset: 'numeric' });
  }

  async create(providerToken: string) {
    const providerData = await this.tokenService.verifyToken(providerToken);
    if (!providerData) throw new ForbiddenException();
    let user = await this.userService.createByProvider(providerData);
    while (!user) {
      user = await this.userService.createByProvider({
        ...providerData,
        username: this.generateUsername(providerData.username),
      });
    }
    return this.tokenService.getJwtToken(user, true);
  }

  async merge(userId: string, providerToken: string) {
    const providerData = await this.tokenService.verifyToken(providerToken);
    if (!providerData) throw new ForbiddenException();
    const accounts = await this.userService.getAccounts(userId);
    if (accounts.some((acc) => acc.provider === providerData.provider))
      throw new ForbiddenException();
    return this.userService.addProvider(userId, providerData);
  }

  async unlink(id: string, provider: provider) {
    return this.userService.deleteProvider(id, provider);
  }
}
