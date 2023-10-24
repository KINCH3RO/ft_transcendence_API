import { Controller, Headers, HttpException, HttpStatus, Query } from '@nestjs/common';
import { Post, Body, Get, Patch, Delete, Param } from '@nestjs/common';
import { CreateFriendRequestDb, CreateFriendRequestDto } from '../../dto/create-friend.dto';
import { FriendRequestService } from '../../services/friend-request/friend-request.service';
import { FriendRequest } from '../../entities/friendRequest.entity';
import { UUID } from 'crypto';
import { query } from 'express';
import { ActiveUser } from 'src/iam/authentication/decorators/active-user.decorator';
import { ActiveUserData } from 'src/iam/interfaces/active-user.interface';
@Controller('friendRequest')
export class FriendRequestController {
	constructor(private friendRequestService: FriendRequestService) { }
	@Post()
	async create(@ActiveUser() activeUser: ActiveUserData, @Body() createFriendRequestDto: CreateFriendRequestDto) {

		return this.friendRequestService.sendRequest(activeUser.sub,
			{
				senderID: activeUser.sub,
				receiverID: createFriendRequestDto.receiverID
			});
	}

	@Get()
	async findAll() {
		return this.friendRequestService.findAll();
	}

	@Get()
	async findOne(@Query("senderID") senderID: string, @Query("receiverID") receiverID: string) {
		return this.friendRequestService.findOne({ senderID: senderID, receiverID: receiverID });
	}
	@Get('/received')
	async getFriendRequests(@ActiveUser() sub: ActiveUserData) {
		return this.friendRequestService.getFriendRequests(sub.sub);
	}

	@Delete()
	async remove(@Query('senderID') receiverID: string, @Query('receiverID') senderID: string) {

		return this.friendRequestService.remove(receiverID, senderID);
	}

	@Post("accept")
	async acceptRequest(@ActiveUser() activeUser: ActiveUserData, @Body() createFriendRequestDto: CreateFriendRequestDb) {
		return this.friendRequestService.acceptRequest(createFriendRequestDto);
	}
}
