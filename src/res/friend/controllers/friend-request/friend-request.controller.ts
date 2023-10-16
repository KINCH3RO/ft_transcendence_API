import { Controller, HttpException, HttpStatus, Query } from '@nestjs/common';
import { Post, Body, Get, Patch, Delete, Param } from '@nestjs/common';
import { CreateFriendRequestDto } from '../../dto/create-friend.dto';
import { FriendRequestService } from '../../services/friend-request/friend-request.service';
import { FriendRequest } from '../../entities/friendRequest.entity';
import { UUID } from 'crypto';
@Controller('friend-request')
export class FriendRequestController {
	constructor(private friendRequestService: FriendRequestService) { }
	@Post()
	async create(@Body() createFriendRequestDto: CreateFriendRequestDto): Promise<FriendRequest> {
		const exist: boolean = await this.friendRequestService.checkExistence(createFriendRequestDto) > 0;
		if (exist)
			throw new HttpException('Friend Request already exists', HttpStatus.FORBIDDEN);
		return this.friendRequestService.create(createFriendRequestDto);
	}

	@Get()
	async findAll() {
		return this.friendRequestService.findAll();
	}

	@Get(':id')
	async findOne(@Param('id') id: UUID) {
		return this.friendRequestService.findOne(id);
	}

	@Get('/receivedRequests/:id')
	async getFriendRequests(@Param('id') receiverID: UUID) {
		return this.friendRequestService.getFriendRequests(receiverID);
	}


	@Delete()
	async remove(@Query('recieverID') recieverID: UUID, @Query('recieverID') senderID: UUID) {
		return this.friendRequestService.remove(recieverID, senderID);
	}
}
