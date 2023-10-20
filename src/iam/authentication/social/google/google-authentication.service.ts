import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/res/users/users.service';
import { provider } from '@prisma/client';

@Injectable()
export class GoogleAuthenticationService {
  constructor(private userService: UsersService) {}
  signIn(ProviderData: any) {
    const user = this.userService.findByProviderId(
      ProviderData.id,
      provider.GOOGLE,
    );
    // if (!user)
    // create user
    // sign token send it
  }
}
