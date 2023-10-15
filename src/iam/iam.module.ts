import { Module } from '@nestjs/common';
import { HashingService } from './hashing/hashing.service';
import { AuthenticationController } from './authentication/authentication.controller';
import { AuthenticationService } from './authentication/authentication.service';


@Module({
  providers: [HashingService, AuthenticationService],
  controllers: [AuthenticationController],
  imports: []
})
export class IamModule {}
