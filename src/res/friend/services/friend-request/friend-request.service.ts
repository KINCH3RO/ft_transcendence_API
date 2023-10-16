import { Injectable } from '@nestjs/common';
import { CreateFriendRequestDto } from '../../dto/create-friend.dto';
import { UpdateFriendRequestDto } from '../../dto/update-friend.dto';
import { FriendRequest } from '../../entities/friendRequest.entity';
import { friendRequests } from '@prisma/client';
import { UUID } from 'crypto';
import { PrismaService } from 'src/prisma/prisma.service';
import { FriendStatus } from '../../entities/friendStatus.entity';
@Injectable()
export class FriendRequestService {
	constructor(private prismaService: PrismaService) {

	}


	async create(createFriendRequestDto: CreateFriendRequestDto): Promise<FriendRequest> {
		return this.prismaService.friendRequests.create({
			data: createFriendRequestDto
		})

	}

	async getFriendRequests(receiverID : string): Promise<FriendRequest[]> {
		return this.prismaService.friendRequests.findMany({
			where: { receiverID: receiverID }
		})
	}

	findAll(): Promise<FriendRequest[]> {
		return this.prismaService.friendRequests.findMany();
	}



	remove(receiverID : string, senderID : string): Promise<{ count: number }> {
		return this.prismaService.friendRequests.deleteMany(
			{
				where: {
					OR: [
						{ senderID: senderID, receiverID: receiverID },
						{ receiverID: senderID, senderID: receiverID }
					]
				}
			})
	}

	findOne(createFriendRequestDto: CreateFriendRequestDto): Promise<FriendRequest> {
		return this.prismaService.friendRequests.findFirst({
			where:
			{
				OR: [
					{
						receiverID: createFriendRequestDto.receiverID,
						senderID: createFriendRequestDto.senderID
					}

					, {
						receiverID: createFriendRequestDto.senderID,
						senderID: createFriendRequestDto.receiverID
					}
				]
			}
		})
	}

	acceptRequest(createFriendRequestDto: CreateFriendRequestDto): Promise<[FriendStatus, any]> {
		return this.prismaService.$transaction(
			[
				this.prismaService.friendStatus.create({ data: createFriendRequestDto }),
				this.prismaService.friendRequests.deleteMany(
					{
						where:
						{
							OR: [
								{ senderID: createFriendRequestDto.senderID, receiverID: createFriendRequestDto.receiverID },
								{ receiverID: createFriendRequestDto.senderID, senderID: createFriendRequestDto.receiverID },
							]
						}
					})
			]
		)
	}
}
