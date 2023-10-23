import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/res/users/users.service';
import { TokenService } from 'src/iam/jwt/token.service';
import { ProviderUserData } from 'src/iam/interfaces/provider-data.interface';

@Injectable()
export class ProviderAuthenticationService {
  constructor(
    private userService: UsersService,
    private tokenService: TokenService,
  ) {}
  async signIn(providerUserData: ProviderUserData) {
    let user = await this.userService.findByProviderId(
      providerUserData.id,
      providerUserData.providerType,
    );
    if (!user)
      user = await this.userService.createByProvider(
        providerUserData,
        providerUserData.providerType,
      );
    return this.tokenService.getJwtToken(user);
  }
}
