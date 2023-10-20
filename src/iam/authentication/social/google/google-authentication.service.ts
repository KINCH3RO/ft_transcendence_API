import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/res/users/users.service';
import { provider } from '@prisma/client';
import { TokenService } from 'src/iam/jwt/token.service';

@Injectable()
export class GoogleAuthenticationService {
  constructor(
    private userService: UsersService,
    private tokenService: TokenService,
  ) {}
  async signIn(ProviderData: any) {
    let user = await this.userService.findByProviderId(
      ProviderData.id,
      provider.GOOGLE,
    );
    if (!user)
      user = await this.userService.createByProvider(
        ProviderData,
        provider.GOOGLE,
      );
    return this.tokenService.getJwtToken(user);
  }
}
