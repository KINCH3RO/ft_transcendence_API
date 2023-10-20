import { Module } from '@nestjs/common';
import { ChannelService } from './channel.service';
import { ChannelController } from './channel.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { IamModule } from 'src/iam/iam.module';

@Module({
  imports: [PrismaModule, IamModule],
  controllers: [ChannelController],
  providers: [ChannelService],
})
export class ChannelModule {}
