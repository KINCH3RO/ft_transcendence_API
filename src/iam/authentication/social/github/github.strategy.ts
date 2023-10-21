import { PassportStrategy } from '@nestjs/passport';
import { provider } from '@prisma/client';
import { Profile, Strategy } from 'passport-github2';
import { ProviderUserData } from 'src/iam/interfaces/provider-data.interface';

export class GithubStrategy extends PassportStrategy(Strategy, 'github') {
  constructor() {
    super({
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: 'http://localhost:3001/githubAuthentication/redirect',
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
      email: null, 
      providerType: provider.GITHUB,
    };
	console.log(user)
    done(null, user);
  }
}
