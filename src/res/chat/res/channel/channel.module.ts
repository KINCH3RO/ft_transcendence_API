import { Module } from '@nestjs/common';
import { ChannelService } from './channel.service';
import { ChannelController } from './channel.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ChannelUserService } from './channel-user.service';
import { ChannelUserController } from './channel-user.controller';
import { HashingModule } from 'src/hashing/hashing.module';

@Module({
  imports: [PrismaModule, HashingModule],
  controllers: [ChannelController, ChannelUserController],
  providers: [ChannelService, ChannelUserService],
})
export class ChannelModule {}
