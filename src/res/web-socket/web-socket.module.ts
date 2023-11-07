import { Module } from '@nestjs/common';
import { WebSocketService } from './services/web-socket.service';
import { ChatGate } from './gateways/chat.gateway';
import { MainGate } from './gateways/main.gateway';
import { JwtModule } from '@nestjs/jwt';
import { TokenGuard } from './token.guard';
import { FriendGate } from './gateways/friend.gateway';
import { MessageGate } from './gateways/message.gateway';
import { LobbyGate } from './gateways/lobby.gateway';
import { LobbyService } from './services/lobby.service';
import { ProfileModule } from '../profile/profile.module';

@Module({
	exports: [WebSocketService],
	imports: [JwtModule, ProfileModule],
	providers: [FriendGate, ChatGate, MessageGate, MainGate, WebSocketService, LobbyGate, LobbyService],
})
export class WebSocketModule { }
