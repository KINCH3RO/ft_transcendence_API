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
	async create(@Headers('userID') userID: string, @Body() createFriendRequestDto: CreateFriendRequestDto) {
		const exception: HttpException = new HttpException("", HttpStatus.FORBIDDEN)
		return this.friendRequestService.sendRequest(userID, createFriendRequestDto, exception);
	}

	@Get()
	async findAll() {
		return this.friendRequestService.findAll();
	}

	@Get()
	async findOne(@Query("senderID") senderID: string, @Query("receiverID") receiverID: string) {
		return this.friendRequestService.findOne({ senderID: senderID, receiverID: receiverID });
	}
	@Get('/receivedRequests/:id')
	async getFriendRequests(@Headers('userID') userID: string) {
		return this.friendRequestService.getFriendRequests(userID);
	}

	@Delete()
	async remove(@Query('receiverID') receiverID: string, @Query('receiverID') senderID: string) {
		return this.friendRequestService.remove(receiverID, senderID);
	}

	@Post("accept")
	async acceptRequest(@Body() createFriendRequestDto: CreateFriendRequestDto) {
		return this.friendRequestService.acceptRequest(createFriendRequestDto);
	}
}
