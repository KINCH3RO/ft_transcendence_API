import { Module } from '@nestjs/common';
import { FriendRequestController } from './controllers/friend-request/friend-request.controller';
import { FriendStatusController } from './controllers/friend-status/friend-status.controller';
import { FriendStatusService } from './services/friend-status/friend-status.service';
import { FriendRequestService } from './services/friend-request/friend-request.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PrismaService } from 'src/prisma/prisma.service';
import { friendRequests, user } from '@prisma/client';
import { WebSocketModule } from '../web-socket/web-socket.module';

@Module({
	controllers: [FriendRequestController, FriendStatusController],
	providers: [FriendStatusService, FriendRequestService],
	imports: [PrismaModule,WebSocketModule],
})
export class FriendModule  {


}
