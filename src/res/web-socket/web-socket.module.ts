import { Module } from '@nestjs/common';
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
import { PrismaModule } from 'src/prisma/prisma.module';
import { MatchmakingService } from './services/matchmaking.service';
import { RepoModule } from '../repo/repo.module';

@Module({
  exports: [WebSocketService],
  imports: [JwtModule, ProfileModule, GameModule, PrismaModule, RepoModule],
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
export class WebSocketModule {}
