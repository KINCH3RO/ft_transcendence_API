import { Controller, Post, Get, Delete, Body, Param, Query, Patch } from '@nestjs/common';
import { FriendStatusService } from '../../services/friend-status/friend-status.service';
import { CreateFriendRequestDto, CreateFriendStatusDto } from '../../dto/create-friend.dto';
import { FriendStatus } from '../../entities/friendStatus.entity';
import { UUID } from 'crypto';
import { UpdateFriendStatusDto } from '../../dto/update-friend.dto';
import { FriendRequestService } from '../../services/friend-request/friend-request.service';

@Controller('friend-status')
export class FriendStatusController {


	constructor(private friendStatusService: FriendStatusService, private friendRequestService: FriendRequestService) { }
	@Post()
	async create(@Body() createFriendStatusDto: CreateFriendStatusDto) {
		return this.friendStatusService.create(createFriendStatusDto);
	}

	@Get()
	async findAll() {
		return this.friendStatusService.findAll();
	}

	@Get(':id')
	async findOne(@Param('id') id: UUID) {
		return this.friendStatusService.findOne(id);
	}


	@Patch()
	async update(@Body() updateFriendStatusDto: UpdateFriendStatusDto) {
		return this.friendStatusService.update(updateFriendStatusDto);
	}

	@Delete()
	async remove(@Query('recieverID') recieverID: UUID, @Query('recieverID') senderID: UUID) {
		return this.friendStatusService.remove(recieverID, senderID);
	}

	@Post("acceptRequest")
	async acceptRequest(@Body() createFriendRequestDto: CreateFriendRequestDto) {
		return this.friendStatusService.acceptRequest(createFriendRequestDto);
	}
}
