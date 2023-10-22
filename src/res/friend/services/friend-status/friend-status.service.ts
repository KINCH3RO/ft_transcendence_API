import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateFriendRequestDto, CreateFriendStatusDto } from '../../dto/create-friend.dto';
import { UpdateFriendStatusDto } from '../../dto/update-friend.dto';
import { FriendStatus } from '../../entities/friendStatus.entity';
import { UUID } from 'crypto';
import { FriendRequestService } from '../friend-request/friend-request.service';
import { FriendRequest } from '../../entities/friendRequest.entity';
import { PrismaService } from 'src/prisma/prisma.service';
import { $Enums, friendStatus } from '@prisma/client';
import { WsException } from '@nestjs/websockets';

@Injectable()
export class FriendStatusService {


	constructor(private prismaService: PrismaService) { }

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




	async getFriendsList(userID: string): Promise<friendStatus[]> {
		const friends: friendStatus[] = await this.prismaService.friendStatus.findMany({
			include: {
				sender: {
					select:
					{
						avatarUrl: true,
						userName: true,
						id: true,
					}
				},
				receiver: {
					select:
					{
						avatarUrl: true,
						userName: true,
						id: true,
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

		return friends.map((data: FriendStatus) => {
			let baseData = {
				blockStatus: data.blockStatus,
				muteStatus: data.muteStatus,
				receiverID: data.receiverID,
				senderID: data.senderID,
			}

			if (userID != data.receiverID)
				baseData["friend"] = data.receiver;
			if (userID != data.senderID)
				baseData["friend"] = data.sender;
			baseData["sender"] = (userID == data.senderID)
			return baseData;
		});

	}


	async blockUser(userID: string, updateFriendStatusDto: UpdateFriendStatusDto) {
		let friendStatus: FriendStatus = await this.findOne(updateFriendStatusDto.senderID, updateFriendStatusDto.receiverID);
		if (!friendStatus)
			throw new WsException("Forbidden");
		const blockValue: $Enums.actionStatus = friendStatus.senderID == userID ? "SENDER" : "RECEIVER";
		if (friendStatus.blockStatus == blockValue || friendStatus.blockStatus == "BOTH")
			return new WsException("User already blocked");
		if (friendStatus.blockStatus == "NONE")
			friendStatus.blockStatus = blockValue;
		else if (friendStatus.blockStatus != blockValue)
			friendStatus.blockStatus = "BOTH";
		return this.update(friendStatus);
	}

	async unblockUser(userID: string, updateFriendStatusDto: UpdateFriendStatusDto) {
		let friendStatus: FriendStatus = await this.findOne(updateFriendStatusDto.senderID, updateFriendStatusDto.receiverID);
		if (!friendStatus)
			throw new HttpException("Forbbiden", HttpStatus.FORBIDDEN);

		const blockValue: $Enums.actionStatus = friendStatus.senderID == userID ? "RECEIVER" : "SENDER";

		if (friendStatus.blockStatus == "NONE" || friendStatus.blockStatus == blockValue)
			return new WsException("User is not Blocked");
		if (friendStatus.blockStatus == "BOTH")
			friendStatus.blockStatus = blockValue;
		else if (friendStatus.blockStatus != blockValue)
			friendStatus.blockStatus = "NONE";
		return this.update(friendStatus);
	}


	async muteUser(userID: string, updateFriendStatusDto: UpdateFriendStatusDto) {
		let friendStatus: FriendStatus = await this.findOne(updateFriendStatusDto.senderID, updateFriendStatusDto.receiverID);
		if (!friendStatus)
			throw new WsException("Forbidden");
		const muteValue: $Enums.actionStatus = friendStatus.senderID == userID ? "SENDER" : "RECEIVER";
		if (friendStatus.muteStatus == muteValue || friendStatus.muteStatus == "BOTH")
			return new WsException("User already muted");
		if (friendStatus.muteStatus == "NONE")
			friendStatus.muteStatus = muteValue;
		else if (friendStatus.muteStatus != muteValue)
			friendStatus.muteStatus = "BOTH";
		return this.update(friendStatus);
	}

	async unmuteUser(userID: string, updateFriendStatusDto: UpdateFriendStatusDto) {
		let friendStatus: FriendStatus = await this.findOne(updateFriendStatusDto.senderID, updateFriendStatusDto.receiverID);
		if (!friendStatus)
			throw new HttpException("Forbbiden", HttpStatus.FORBIDDEN);
		const muteValue: $Enums.actionStatus = friendStatus.senderID == userID ? "RECEIVER" : "SENDER";
		if (friendStatus.muteStatus == "NONE" || friendStatus.muteStatus == muteValue)
			return new WsException("User is not mutee=d");
		if (friendStatus.muteStatus == "BOTH")
			friendStatus.muteStatus = muteValue;
		else if (friendStatus.muteStatus != muteValue)
			friendStatus.muteStatus = "NONE";
		return this.update(friendStatus);
	}


}
