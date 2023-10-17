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

console.log(jwtConstants.secret);
@Module({
  providers: [
    HashingService,
    AuthenticationService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
  controllers: [AuthenticationController],
  imports: [
    PrismaModule,
    UsersModule,
    JwtModule.register({
      secret: jwtConstants.secret,
    }),
  ],
})
export class IamModule {}
