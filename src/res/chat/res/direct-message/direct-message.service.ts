import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { $Enums, directMessage } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { DirectMessage } from './entities/direct-message.entity';

import { WebSocketService } from 'src/res/web-socket/services/web-socket.service';
import { UpdateDirectMessageDto } from './update-directMessage.dto';

@Injectable()
export class DirectMessageService {
	constructor(
		private prisma: PrismaService,
		private webSocketService: WebSocketService,
	) { }

	async create(senderId: string, receiverId: string) {
		let dm = await this.findOne(senderId, receiverId)
		if (!dm)
			dm = await this.prisma.directMessage.create({
				include: {
					sender: {
						select: {
							avatarUrl: true,
							userName: true,
							id: true,
							onlineStatus: true,
							fullName: true,
							profile: {
								select: {
									id: true,
									rating: true,
								},
							},
						},
					},
					receiver: {
						select: {
							avatarUrl: true,
							userName: true,
							id: true,
							onlineStatus: true,
							fullName: true,
							profile: {
								select: {
									id: true,
									rating: true,
								},
							},
						},
					},
				},
				data: {

					receiverID: receiverId,
					senderID: senderId,
					message: {},
				},
			});



		return dm;
	}

	findYourDM(senderId: string) {
		return this.prisma.directMessage.findMany({
			where: { senderID: senderId },
		});
	}

	remove(DmId: string) {
		return this.prisma.directMessage.delete({ where: { id: DmId } });
	}

	// findDMByReciverName

	async listCurrentDM(userID: string) {
		const dms: directMessage[] = await this.prisma.directMessage.findMany({
			include: {
				sender: {
					select: {
						avatarUrl: true,
						userName: true,
						id: true,
						onlineStatus: true,
						fullName: true,
						profile: {
							select: {
								id: true,
								rating: true,
							},
						},
					},
				},
				receiver: {
					select: {
						avatarUrl: true,
						userName: true,
						id: true,
						onlineStatus: true,
						fullName: true,
						profile: {
							select: {
								id: true,
								rating: true,
							},
						},
					},
				},
				message: {
					take: 1,
					orderBy: {
						createdAt: 'desc',
					},
					select: {
						senderID: true,
						content: true,
						attachment: true,
						createdAt: true,
						updatedAt: true,
					},
				},
			},
			where: {
				OR: [{ senderID: userID }, { receiverID: userID }],
			},
		});


		return dms.map((data: DirectMessage) => {
			let baseData: DirectMessage = {
				id: data.id,
				receiverID: data.receiverID,
				senderID: data.senderID,
				blockStatus: data.blockStatus,
				muteStatus: data.muteStatus,
			};

			if (userID != data.receiverID) baseData['friend'] = data.receiver;
			if (userID != data.senderID) baseData['friend'] = data.sender;
			baseData['isSender'] = userID == data.senderID;
			baseData['friend'].onlineStatus = this.webSocketService.isOnline(
				baseData['friend'].id,
			);
			baseData['message'] = data.message[0];

			return baseData;
		});
	}
	findOne(receiverID: string, senderID: string) {
		return this.prisma.directMessage.findFirst({
			include: {
				sender: {
					select: {
						avatarUrl: true,
						userName: true,
						id: true,
						onlineStatus: true,
						fullName: true,
						profile: {
							select: {
								id: true,
								rating: true,
							},
						},
					},
				},
				receiver: {
					select: {
						avatarUrl: true,
						userName: true,
						id: true,
						onlineStatus: true,
						fullName: true,
						profile: {
							select: {
								id: true,
								rating: true,
							},
						},
					},
				},
			},
			where: {
				OR: [
					{ receiverID: receiverID, senderID: senderID },
					{ receiverID: senderID, senderID: receiverID },
				],
			},
		});
	}

	update(updateDirectMessageDto: UpdateDirectMessageDto): Promise<{ count }> {
		return this.prisma.directMessage.updateMany({
			data: updateDirectMessageDto,
			where: {
				OR: [
					{
						senderID: updateDirectMessageDto.senderID,
						receiverID: updateDirectMessageDto.receiverID,
					},
					{
						receiverID: updateDirectMessageDto.senderID,
						senderID: updateDirectMessageDto.receiverID,
					},
				],
			},
		});
	}

	async blockUser(
		userID: string,
		updateDirectMessageDto: UpdateDirectMessageDto,
	) {
		let dirMessage: directMessage = await this.findOne(
			updateDirectMessageDto.senderID,
			updateDirectMessageDto.receiverID,
		);
		if (!dirMessage) throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
		const blockValue: $Enums.actionStatus =
			dirMessage.senderID == userID ? 'SENDER' : 'RECEIVER';
		if (
			dirMessage.blockStatus == blockValue ||
			dirMessage.blockStatus == 'BOTH'
		)
			return new HttpException('User already blocked', HttpStatus.FORBIDDEN);
		if (dirMessage.blockStatus == 'NONE') dirMessage.blockStatus = blockValue;
		else if (dirMessage.blockStatus != blockValue)
			dirMessage.blockStatus = 'BOTH';
		return this.update(dirMessage);
	}

	async unblockUser(
		userID: string,
		updateDirectMessageDto: UpdateDirectMessageDto,
	) {
		let dirMessage: directMessage = await this.findOne(
			updateDirectMessageDto.senderID,
			updateDirectMessageDto.receiverID,
		);
		if (!dirMessage) throw new HttpException('Forbbiden', HttpStatus.FORBIDDEN);

		const blockValue: $Enums.actionStatus =
			dirMessage.senderID == userID ? 'RECEIVER' : 'SENDER';

		if (
			dirMessage.blockStatus == 'NONE' ||
			dirMessage.blockStatus == blockValue
		)
			return new HttpException('User is not Blocked', HttpStatus.FORBIDDEN);
		if (dirMessage.blockStatus == 'BOTH') dirMessage.blockStatus = blockValue;
		else if (dirMessage.blockStatus != blockValue)
			dirMessage.blockStatus = 'NONE';
		return this.update(dirMessage);
	}

	async muteUser(
		userID: string,
		updateDirectMessageDto: UpdateDirectMessageDto,
	) {
		let dirMessage: directMessage = await this.findOne(
			updateDirectMessageDto.senderID,
			updateDirectMessageDto.receiverID,
		);
		if (!dirMessage) throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
		const muteValue: $Enums.actionStatus =
			dirMessage.senderID == userID ? 'SENDER' : 'RECEIVER';
		if (dirMessage.muteStatus == muteValue || dirMessage.muteStatus == 'BOTH')
			return new HttpException('User already muted', HttpStatus.FORBIDDEN);
		if (dirMessage.muteStatus == 'NONE') dirMessage.muteStatus = muteValue;
		else if (dirMessage.muteStatus != muteValue) dirMessage.muteStatus = 'BOTH';
		return this.update(dirMessage);
	}

	async unmuteUser(
		userID: string,
		updateDirectMessageDto: UpdateDirectMessageDto,
	) {
		let dirMessage: directMessage = await this.findOne(
			updateDirectMessageDto.senderID,
			updateDirectMessageDto.receiverID,
		);
		if (!dirMessage) throw new HttpException('Forbbiden', HttpStatus.FORBIDDEN);
		const muteValue: $Enums.actionStatus =
			dirMessage.senderID == userID ? 'RECEIVER' : 'SENDER';
		if (dirMessage.muteStatus == 'NONE' || dirMessage.muteStatus == muteValue)
			return new HttpException('User is not muted', HttpStatus.FORBIDDEN);
		if (dirMessage.muteStatus == 'BOTH') dirMessage.muteStatus = muteValue;
		else if (dirMessage.muteStatus != muteValue) dirMessage.muteStatus = 'NONE';
		return this.update(dirMessage);
	}
}
