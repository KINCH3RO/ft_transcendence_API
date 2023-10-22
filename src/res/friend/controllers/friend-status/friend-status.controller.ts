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
	@Get(':id')
	async findOne(@Query("senderID") senderID: string, @Query("receiverID") receiverID: string) {
		return this.friendStatusService.findOne(senderID, receiverID);
	}


	@Patch("blockUser")
	async blockUser(@ActiveUser() activeUser: ActiveUserData, @Body() updateFriendStatusDto: UpdateFriendStatusDto) {
		this.friendStatusService.blockUser(activeUser.sub, updateFriendStatusDto);
	}

	@Patch("muteUser")
	async updateUser(@ActiveUser() activeUser: ActiveUserData, @Body() updateFriendStatusDto: UpdateFriendStatusDto) {
		this.friendStatusService.muteUser(activeUser.sub, updateFriendStatusDto);
	}



	@Patch("unblockUser")
	async unBlockUser(@ActiveUser() activeUser: ActiveUserData, @Body() updateFriendStatusDto: UpdateFriendStatusDto) {
		this.friendStatusService.unblockUser(activeUser.sub, updateFriendStatusDto);
	}


	@Patch("unmuteUser")
	async unmuteUser(@ActiveUser() activeUser: ActiveUserData, @Body() updateFriendStatusDto: UpdateFriendStatusDto) {
		this.friendStatusService.unmuteUser(activeUser.sub, updateFriendStatusDto);
	}

	@Delete()
	async remove(@Query('receiverID') receiverID: string, @Query('receiverID') senderID: string) {
		return this.friendStatusService.remove(receiverID, senderID);
	}


}
