import { Module } from '@nestjs/common';
import { FriendRequestController } from './controllers/friend-request/friend-request.controller';
import { FriendStatusController } from './controllers/friend-status/friend-status.controller';
import { FriendStatusService } from './services/friend-status/friend-status.service';
import { FriendRequestService } from './services/friend-request/friend-request.service';
import { PrismaService } from 'src/services/prisma/prisma.service';

@Module({
	controllers: [FriendRequestController, FriendStatusController],
	providers: [FriendStatusService, FriendRequestService,PrismaService],
	imports: [],
})
export class FriendModule { }
