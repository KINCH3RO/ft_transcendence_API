import { Injectable } from '@nestjs/common';
import { CreateFriendRequestDto } from '../../dto/create-friend.dto';
import { UpdateFriendRequestDto } from '../../dto/update-friend.dto';
import { FriendRequest } from '../../entities/friendRequest.entity';
import { friendRequests } from '@prisma/client';
import { UUID } from 'crypto';
import { PrismaService } from 'src/prisma/prisma.service';
@Injectable()
export class FriendRequestService {
	constructor(private prismaService: PrismaService) { }
	async create(createFriendRequestDto: CreateFriendRequestDto): Promise<FriendRequest> {
		return this.prismaService.friendRequests.create({
			data: createFriendRequestDto
		})

	}

	async getFriendRequests(recieverId: UUID): Promise<FriendRequest[]> {
		return this.prismaService.friendRequests.findMany({
			where: { receiverID: recieverId }
		})
	}

	findAll(): Promise<FriendRequest[]> {
		return this.prismaService.friendRequests.findMany();
	}

	findOne(id: UUID): Promise<FriendRequest> {
		return this.prismaService.friendRequests.findFirst({
			where: {
				OR: [
					{ receiverID: id },
					{ senderID: id }
				]
			}
		})
	}

	remove(recieverId: UUID, senderId: UUID): Promise<FriendRequest> {
		return this.prismaService.friendRequests.delete(
			{
				where: {
					senderID_receiverID: {
						receiverID: recieverId,
						senderID: senderId
					}
				}
			})
	}

	checkExistence(createFriendRequestDto: CreateFriendRequestDto): Promise<number> {
		return this.prismaService.friendRequests.count({
			where: {
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
}
