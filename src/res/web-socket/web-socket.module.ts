import { Module } from '@nestjs/common';
import { WebSocketService } from './web-socket.service';
import { ChatGate } from './chat.gateway';
import { MainGate } from './main.gateway';
import { JwtModule } from '@nestjs/jwt';
import { TokenGuard } from './token.guard';
import { FriendGate } from './friend.gateway';
import { MessageGate } from './message.gateway';
import { LobbyGate } from './lobby.gateway';

@Module({
	exports: [WebSocketService],
	imports: [JwtModule],
	providers: [FriendGate, ChatGate, MessageGate, MainGate, WebSocketService, LobbyGate],
})
export class WebSocketModule { }
