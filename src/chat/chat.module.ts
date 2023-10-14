import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { DirectMessageModule } from './direct-message/direct-message.module';
import { ChannelModule } from './channel/channel.module';

@Module({
  controllers: [ChatController],
  providers: [ChatService],
  imports: [DirectMessageModule, ChannelModule],
})
export class ChatModule {}
