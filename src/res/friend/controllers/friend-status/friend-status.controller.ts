import { Controller, Post, Get, Delete, Body, Param, Query, Patch, Headers, HttpException, HttpStatus } from '@nestjs/common';
import { FriendStatusService } from '../../services/friend-status/friend-status.service';
import { CreateFriendRequestDto, CreateFriendStatusDto } from '../../dto/create-friend.dto';
import { FriendStatus } from '../../entities/friendStatus.entity';
import { UUID } from 'crypto';
import { UpdateFriendStatusDto } from '../../dto/update-friend.dto';
import { FriendRequestService } from '../../services/friend-request/friend-request.service';
import { $Enums } from '@prisma/client';

@Controller('friendStatus')
export class FriendStatusController {


	constructor(private friendStatusService: FriendStatusService) { }
	@Post()
	async create(@Body() createFriendStatusDto: CreateFriendStatusDto) {
		return this.friendStatusService.create(createFriendStatusDto);
	}

	@Get()
	async findAll() {
		return this.friendStatusService.findAll();
	}

	@Get(':id')
	async findOne(@Query("senderID") senderID: string, @Query("receiverID") receiverID: string) {
		return this.friendStatusService.findOne(senderID, receiverID);
	}

	@Get("friendsList/:id")
	async findFriends(@Param("id") userID: string) {
		return this.friendStatusService.getFriendsList(userID);
	}




	@Patch("blockUser")
	async blockUser(@Headers('userID') userID: string, @Body() updateFriendStatusDto: UpdateFriendStatusDto) {
		let friendStatus: FriendStatus = await this.friendStatusService.findOne(updateFriendStatusDto.senderID, updateFriendStatusDto.receiverID);
		if (!friendStatus)
			throw new HttpException("Forbbiden", HttpStatus.FORBIDDEN);
		const blockValue: $Enums.actionStatus = friendStatus.senderID == userID ? "SENDER" : "RECEIVER";
		if (friendStatus.blockStatus == blockValue || friendStatus.blockStatus == "BOTH")
			return new HttpException("User already Blocked", HttpStatus.ACCEPTED);
		if (friendStatus.blockStatus == "NONE")
			friendStatus.blockStatus = blockValue;
		else if (friendStatus.blockStatus != blockValue)
			friendStatus.blockStatus = "BOTH";
		return this.friendStatusService.update(friendStatus);
	}

	@Patch("muteUser")
	async updateUser(@Headers('userID') userID: string, @Body() updateFriendStatusDto: UpdateFriendStatusDto) {
		let friendStatus: FriendStatus = await this.friendStatusService.findOne(updateFriendStatusDto.senderID, updateFriendStatusDto.receiverID);
		if (!friendStatus)
			throw new HttpException("Forbbiden", HttpStatus.FORBIDDEN);
		const muteValue: $Enums.actionStatus = friendStatus.senderID == userID ? "SENDER" : "RECEIVER";
		if (friendStatus.muteStatus == muteValue || friendStatus.muteStatus == "BOTH")
			return new HttpException("User already muteed", HttpStatus.ACCEPTED);
		if (friendStatus.muteStatus == "NONE")
			friendStatus.muteStatus = muteValue;
		else if (friendStatus.muteStatus != muteValue)
			friendStatus.muteStatus = "BOTH";
		return this.friendStatusService.update(friendStatus);
	}

	@Delete()
	async remove(@Query('receiverID') receiverID: string, @Query('receiverID') senderID: string) {
		return this.friendStatusService.remove(receiverID, senderID);
	}


}
