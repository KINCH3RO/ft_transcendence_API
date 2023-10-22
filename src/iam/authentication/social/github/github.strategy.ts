import { PassportStrategy } from '@nestjs/passport';
import { provider } from '@prisma/client';
import { Profile, Strategy } from 'passport-github2';
import { ProviderUserData } from 'src/iam/interfaces/provider-data.interface';

export class GithubStrategy extends PassportStrategy(Strategy, 'github') {
  constructor() {
    super({
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: process.env.GITHUB_REDIRECT,
      scope: ['user'],
    });
  }
  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: any,
  ): Promise<any> {
    const user: ProviderUserData = {
      id: profile.id,
      username: profile.username,
      photo: profile.photos[0].value,
      fullName: null,
      email: profile.emails[0].value,
      providerType: provider.GITHUB,
    };
    done(null, user);
  }
}
