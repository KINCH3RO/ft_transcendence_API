import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy, VerifyCallback } from 'passport-google-oauth20';
import { Injectable } from '@nestjs/common';
import { provider } from '@prisma/client';
import { ProviderUserData } from 'src/iam/interfaces/provider-data.interface';
import { IsUUID } from 'class-validator';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor() {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: 'http://localhost:3001/googleAuthentication/redirect',
      scope: ['email', 'profile'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: VerifyCallback,
  ): Promise<any> {
    const user: ProviderUserData = {
      id: profile.id,
      username: profile.displayName,
      fullName: profile.name.familyName + " " + profile.name.givenName,
      email: profile.emails[0].value,
      photo: profile.photos ? profile.photos[0].value : null,
      providerType: provider.GOOGLE,
    };
    done(null, user);
  }
}
