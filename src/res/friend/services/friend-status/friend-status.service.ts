import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateFriendRequestDto, CreateFriendStatusDto } from '../../dto/create-friend.dto';
import { UpdateFriendStatusDto } from '../../dto/update-friend.dto';
import { FriendStatus } from '../../entities/friendStatus.entity';
import { UUID } from 'crypto';
import { FriendRequestService } from '../friend-request/friend-request.service';
import { FriendRequest } from '../../entities/friendRequest.entity';
import { PrismaService } from 'src/prisma/prisma.service';
import { $Enums, friendStatus } from '@prisma/client';

import { WebSocketService } from 'src/res/web-socket/services/web-socket.service';

@Injectable()
export class FriendStatusService {


	constructor(private prismaService: PrismaService, private webSocketService: WebSocketService) { }

	create(createFriendStatusDto: CreateFriendStatusDto): Promise<FriendStatus> {
		return this.prismaService.friendStatus.create({ data: createFriendStatusDto })
	}

	findAll(): Promise<FriendStatus[]> {
		return this.prismaService.friendStatus.findMany();
	}

	findOne(receiverID: string, senderID: string) {
		return this.prismaService.friendStatus.findFirst({
			where: {
				OR: [
					{ receiverID: receiverID, senderID: senderID },
					{ receiverID: senderID, senderID: receiverID },
				]
			}
		})
	}

	update(updatefriendStatusDto: UpdateFriendStatusDto): Promise<{ count }> {
		return this.prismaService.friendStatus.updateMany({
			data: updatefriendStatusDto,
			where: {
				OR: [
					{ senderID: updatefriendStatusDto.senderID, receiverID: updatefriendStatusDto.receiverID },
					{ receiverID: updatefriendStatusDto.senderID, senderID: updatefriendStatusDto.receiverID }
				]
			}
		})
	}

	remove(senderID: string, receiverID: string): Promise<{ count }> {
		return this.prismaService.friendStatus.deleteMany({
			where: {
				OR: [
					{ senderID: senderID, receiverID: receiverID },
					{ receiverID: senderID, senderID: receiverID }
				]
			}
		})
	}




	async getFriendsList(userID: string, onlineFriends: boolean = false): Promise<friendStatus[]> {
		let friends: friendStatus[] = await this.prismaService.friendStatus.findMany({
			include: {
				sender: {
					select:
					{
						avatarUrl: true,
						userName: true,
						id: true,
						onlineStatus: true
					}
				},
				receiver: {
					select:
					{
						avatarUrl: true,
						userName: true,
						id: true,
						onlineStatus: true

					}
				}
			},
			where: {

				OR:
					[
						{ senderID: userID },
						{ receiverID: userID },
					]
			}
		})

		friends = friends.map((data: FriendStatus) => {
			let baseData: FriendStatus = {
				receiverID: data.receiverID,
				senderID: data.senderID,
			}

			if (userID != data.receiverID)
				baseData["friend"] = data.receiver;
			if (userID != data.senderID)
				baseData["friend"] = data.sender;
			baseData["isSender"] = (userID == data.senderID)
			baseData["friend"].onlineStatus = this.webSocketService.isOnline(baseData["friend"].id)
			// baseData["profile"]
			return baseData;
		});

		if (onlineFriends)
			return friends.filter(data => data["friend"].onlineStatus == true)
		return friends;
	}





}
