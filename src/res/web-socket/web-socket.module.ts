import { Module, forwardRef } from '@nestjs/common';
import { WebSocketService } from './services/web-socket.service';
import { ChatGate } from './gateways/chat.gateway';
import { MainGate } from './gateways/main.gateway';
import { JwtModule } from '@nestjs/jwt';
import { FriendGate } from './gateways/friend.gateway';
import { MessageGate } from './gateways/message.gateway';
import { LobbyGate } from './gateways/lobby.gateway';
import { LobbyService } from './services/lobby.service';
import { ProfileModule } from '../profile/profile.module';
import { GameModule } from 'src/game/game.module';
import { GameService } from 'src/game/game.service';
import { ChannelModule } from '../chat/res/channel/channel.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { MatchmakingService } from './services/matchmaking.service';

@Module({
	exports: [WebSocketService],
	imports: [JwtModule, ProfileModule, GameModule, PrismaModule],
	providers: [
		FriendGate,
		ChatGate,
		MessageGate,
		MainGate,
		WebSocketService,
		LobbyGate,
		LobbyService,
		MatchmakingService,

	],
})
export class WebSocketModule { }
