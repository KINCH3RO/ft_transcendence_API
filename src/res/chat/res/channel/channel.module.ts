import { Module } from '@nestjs/common';
import { ChannelService } from './channel.service';
import { ChannelController } from './channel.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { IamModule } from 'src/iam/iam.module';
import { ChannelUserService } from './channel-user.service';
import { ChannelUserController } from './channel-user.controller';

@Module({
  imports: [PrismaModule, IamModule],
  controllers: [ChannelController, ChannelUserController],
  providers: [ChannelService, ChannelUserService],
})
export class ChannelModule {}
