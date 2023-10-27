import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { DirectMessageModule } from './res/direct-message/direct-message.module';
import { ChannelModule } from './res/channel/channel.module';
import { MessageModule } from './res/message/message.module';

@Module({
	controllers: [ChatController],
	providers: [ChatService],
	imports: [DirectMessageModule, ChannelModule, MessageModule],
})
export class ChatModule { }
