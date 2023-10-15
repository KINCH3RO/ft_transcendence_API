import { Injectable } from '@nestjs/common';
import { CreateFriendRequestDto, CreateFriendStatusDto } from '../../dto/create-friend.dto';
import { UpdateFriendStatusDto } from '../../dto/update-friend.dto';
import { FriendStatus } from '../../entities/friendStatus.entity';
import { UUID } from 'crypto';
import { FriendRequestService } from '../friend-request/friend-request.service';
import { FriendRequest } from '../../entities/friendRequest.entity';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class FriendStatusService {


	constructor(private prismaService: PrismaService, private friendRequestService: FriendRequestService) { }

	create(createFriendStatusDto: CreateFriendStatusDto): Promise<FriendStatus> {
		return this.prismaService.friendStatus.create({ data: createFriendStatusDto })
	}

	findAll(): Promise<FriendStatus[]> {
		return this.prismaService.friendStatus.findMany();
	}

	findOne(id: UUID) {
		return this.prismaService.friendStatus.findFirst({
			where: {
				OR: [
					{ receiverID: id },
					{ senderID: id }
				]
			}
		})
	}

	update(updatefriendStatusDto: UpdateFriendStatusDto): Promise<FriendStatus> {
		return this.prismaService.friendStatus.update({
			data: updatefriendStatusDto,
			where: {
				senderID_receiverID: {
					senderID: updatefriendStatusDto.senderID,
					receiverID: updatefriendStatusDto.receiverID
				}
			}
		})
	}

	remove(senderID: UUID, receiverID: UUID): Promise<FriendStatus> {
		return this.prismaService.friendStatus.delete({
			where: {
				senderID_receiverID: {
					senderID: senderID,
					receiverID: receiverID
				}
			}
		})
	}

	acceptRequest(createFriendRequestDto: CreateFriendRequestDto) :Promise<[FriendStatus,FriendRequest]> {
		return this.prismaService.$transaction(
			[
				this.prismaService.friendStatus.create({ data: createFriendRequestDto }),
				this.prismaService.friendRequests.delete(
					{
						where: {
							senderID_receiverID: {
								receiverID: createFriendRequestDto.receiverID,
								senderID: createFriendRequestDto.senderID
							}
						}
					})
			]
		)
	}
}
