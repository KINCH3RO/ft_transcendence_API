import { Module } from '@nestjs/common';
import { HashingService } from './hashing/hashing.service';
import { AuthenticationController } from './authentication/authentication.controller';
import { AuthenticationService } from './authentication/authentication.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UsersModule } from 'src/res/users/users.module';
import { jwtConstants } from './jwt/jwtConstants';
import { JwtModule } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './authentication/guards/access-token.guard';
import { ProviderAuthenticationService } from './authentication/social/provider-authentication.service';
import { GoogleAuthenticationController } from './authentication/social/google/google-authentication.controller';
import { GoogleStrategy } from './authentication/social/google/google.strategy';
import { GoogleOAuthGuard } from './authentication/social/google/google-oauth.guard';
import { TokenService } from './jwt/token.service';
import { GithubAuthenticationController } from './authentication/social/github/github-authentication.controller';
import { GithubStrategy } from './authentication/social/github/github.strategy';
import { FortytwoAuthenticationController } from './authentication/social/fortyfTwo/fortytwo-authentication.controller';
import { FortyTwoStrategy } from './authentication/social/fortyfTwo/fortytwo.strategy';
import { FortytwoOAuthGuard } from './authentication/social/fortyfTwo/fortytwo-oauth.guard';


@Module({
  providers: [
    HashingService,
    AuthenticationService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    TokenService,
    ProviderAuthenticationService,
    GoogleStrategy,
    GoogleOAuthGuard,
    GithubStrategy,
    GoogleOAuthGuard,
    FortyTwoStrategy,
    FortytwoOAuthGuard,
  ],
  controllers: [
    AuthenticationController,
    GoogleAuthenticationController,
    GithubAuthenticationController,
    FortytwoAuthenticationController,
  ],
  imports: [
    PrismaModule,
    UsersModule,
    JwtModule.register({
      secret: jwtConstants.secret,
    }),
  ],
})
export class IamModule {}
