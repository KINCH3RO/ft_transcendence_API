import { PassportStrategy } from '@nestjs/passport';
import { provider } from '@prisma/client';
import { Strategy, Profile } from 'passport-42';
import { ProviderUserData } from 'src/iam/interfaces/provider-data.interface';

export class FortyTwoStrategy extends PassportStrategy(Strategy, '42') {
  constructor() {
    super({
      clientID: process.env.FORTYTWO_CLIENT_ID,
      clientSecret: process.env.FORTYTWO_CLIENT_SECRET,
      callbackURL: 'http://localhost:3001/fortytwoAuthentication/redirect',
      profileFields: {
        id: function (obj) {
          return String(obj.id);
        },
        username: 'login',
        displayName: 'displayname',
        'name.familyName': 'last_name',
        'name.givenName': 'first_name',
        profileUrl: 'url',
        'emails.0.value': 'email',
        'phoneNumbers.0.value': 'phone',
        photo: 'image.link',
      },
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
      email: profile.emails[0].value,
      providerType: provider.INTRA,
      username: profile.username,
      fullName: profile.displayName,
      photo: profile.photo,
    };
    done(null, user);
  }
}
