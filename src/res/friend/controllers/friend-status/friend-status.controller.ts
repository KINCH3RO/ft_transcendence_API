import { Controller, Post, Get, Delete, Body, Param, Query, Patch, Headers, HttpException, HttpStatus } from '@nestjs/common';
import { FriendStatusService } from '../../services/friend-status/friend-status.service';
import { CreateFriendRequestDto, CreateFriendStatusDto } from '../../dto/create-friend.dto';
import { FriendStatus } from '../../entities/friendStatus.entity';
import { UUID } from 'crypto';
import { UpdateFriendStatusDto } from '../../dto/update-friend.dto';
import { FriendRequestService } from '../../services/friend-request/friend-request.service';
import { $Enums } from '@prisma/client';
import { ActiveUser } from 'src/iam/authentication/decorators/active-user.decorator';
import { ActiveUserData } from 'src/iam/interfaces/active-user.interface';

@Controller('friendStatus')
export class FriendStatusController {


	constructor(private friendStatusService: FriendStatusService) { }
	// @Post()
	// async create(@Body() createFriendStatusDto: CreateFriendStatusDto) {
	// 	return this.friendStatusService.create(createFriendStatusDto);
	// }

	@Get()
	async findAll() {
		return this.friendStatusService.findAll();
	}

	@Get("list")
	async findFriends(@ActiveUser() userData: ActiveUserData) {
		return this.friendStatusService.getFriendsList(userData.sub);
	}


	@Get("listOnline")
	async findOnlineFriends(@ActiveUser() userData: ActiveUserData) {
		return this.friendStatusService.getFriendsList(userData.sub, true);
	}

	@Get(':id')
	async findOne(@Query("senderID") senderID: string, @Query("receiverID") receiverID: string) {
		return this.friendStatusService.findOne(senderID, receiverID);
	}


	@Delete()
	async remove(@Query('receiverID') receiverID: string, @Query('senderID') senderID: string) {
		return this.friendStatusService.remove(receiverID, senderID);
	}


}
