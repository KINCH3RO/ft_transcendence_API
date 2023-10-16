import { Controller, Headers, HttpException, HttpStatus, Query } from '@nestjs/common';
import { Post, Body, Get, Patch, Delete, Param } from '@nestjs/common';
import { CreateFriendRequestDto } from '../../dto/create-friend.dto';
import { FriendRequestService } from '../../services/friend-request/friend-request.service';
import { FriendRequest } from '../../entities/friendRequest.entity';
import { UUID } from 'crypto';
import { query } from 'express';
@Controller('friendRequest')
export class FriendRequestController {
	constructor(private friendRequestService: FriendRequestService) { }
	@Post()
	async create(@Headers('userID') userID: UUID, @Body() createFriendRequestDto: CreateFriendRequestDto) {
		const friendReq: FriendRequest = await this.friendRequestService.findOne(createFriendRequestDto);
		if (friendReq != null && friendReq.senderID != userID)
			return this.friendRequestService.acceptRequest(createFriendRequestDto);
		else if (friendReq)
			throw new HttpException('Friend Request already exists', HttpStatus.UNAUTHORIZED);
		return this.friendRequestService.create(createFriendRequestDto);
	}

	@Get()
	async findAll() {
		return this.friendRequestService.findAll();
	}

	@Get()
	async findOne(@Query("senderID") senderID: UUID, @Query("receiverID") receiverID: UUID) {
		return this.friendRequestService.findOne({ senderID: senderID, receiverID: receiverID });
	}
	@Get('/receivedRequests/:id')
	async getFriendRequests(@Headers('userID') userID: UUID) {
		return this.friendRequestService.getFriendRequests(userID);
	}

	@Delete()
	async remove(@Query('recieverID') recieverID: UUID, @Query('recieverID') senderID: UUID) {
		return this.friendRequestService.remove(recieverID, senderID);
	}

	@Post("accept")
	async acceptRequest(@Body() createFriendRequestDto: CreateFriendRequestDto) {
		return this.friendRequestService.acceptRequest(createFriendRequestDto);
	}
}
