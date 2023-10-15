import { Module } from '@nestjs/common';
import { HashingService } from './hashing/hashing.service';
import { AuthenticationController } from './authentication/authentication.controller';
import { AuthenticationService } from './authentication/authentication.service';
import { PrismaService } from 'src/services/prisma/prisma.service';


@Module({
  providers: [HashingService, AuthenticationService, PrismaService],
  controllers: [AuthenticationController],
  imports: []
})
export class IamModule {}
