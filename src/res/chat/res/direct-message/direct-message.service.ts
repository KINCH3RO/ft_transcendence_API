import { Injectable } from '@nestjs/common';
import { directMessage } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { DirectMessage } from './entities/direct-message.entity';

import { WebSocketService } from 'src/res/web-socket/web-socket.service';


@Injectable()
export class DirectMessageService {

	constructor(private prisma: PrismaService, private webSocketService: WebSocketService) { }

	create(senderId: string, receiverId: string) {
		return this.prisma.directMessage.create({
			data: {
				receiverID: receiverId,
				senderID: senderId,
				message: {}
			}
		})
	}

	findYourDM(senderId: string) {
		return this.prisma.directMessage.findMany({ where: { senderID: senderId } });
	}

	remove(DmId: string) {
		return this.prisma.directMessage.delete({ where: { id: DmId } });
	}

	// findDMByReciverName

	async listCurrentDM(userID: string) {
		const dms : directMessage[] = await this.prisma.directMessage.findMany({
			include: {
				sender: {
					select:
					{
						avatarUrl: true,
						userName: true,
						id: true,
						onlineStatus: true,
						fullName: true
					}
				},
				receiver: {
					select:
					{
						avatarUrl: true,
						userName: true,
						id: true,
						onlineStatus: true,
						fullName: true
					}
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

		return dms.map((data: DirectMessage) => {
			let baseData: any = {};

			if (userID != data.receiverID)
			{
				baseData["friendID"] = data.receiverID;
				baseData["avatarUrl"] = data.receiver.avatarUrl
				baseData["userName"] = data.receiver.userName
			}
			if (userID != data.senderID)
			{
				baseData["friendID"] = data.senderID;
				baseData["avatarUrl"] = data.sender.avatarUrl
				baseData["userName"] = data.sender.userName
			}
			baseData["isSender"] = (userID == data.senderID)
			baseData["onlineStatus"] = this.webSocketService.isOnline(baseData["friendID"].id)
			baseData["lastMsg"] = data.message

			return baseData;
		});

	}
}
