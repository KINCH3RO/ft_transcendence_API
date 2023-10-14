import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { DirectMessageModule } from './res/direct-message/direct-message.module';
import { ChannelModule } from './res/channel/channel.module';

@Module({
  controllers: [ChatController],
  providers: [ChatService],
  imports: [DirectMessageModule, ChannelModule],
})
export class ChatModule {}
