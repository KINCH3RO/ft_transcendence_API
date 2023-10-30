import { Injectable } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Message } from './entities/message.entity';
import { findMessageDto } from './dto/find-message.dto';

@Injectable()
export class MessageService {
	constructor(private prismaSerivce: PrismaService) {

	}
	async create(userID: string, createMessageDto: CreateMessageDto) {

		let message: Message = await this.prismaSerivce.message.create({
			include:
			{
				directmessage: true,
				attachment: true,
				sender: {
					select:
					{
						avatarUrl: true,
						bannerUrl: true,
						userName: true,
					}
				},
			},
			data:
			{
				content: createMessageDto.content,
				senderID: userID,
				channelID: createMessageDto.channelID,
				directmessageID: createMessageDto.directmessageID,
				attachment:
				{
					create: createMessageDto.attachment
				}

			}
		})

		message.mine = (message.senderID == userID);
		return message;

	}

	async findChannelMessages(userID: string, dto: findMessageDto) {
		const messages: Message[] = await this.prismaSerivce.message.findMany({
			include:
			{
				attachment: true,
				sender: {
					select:
					{
						avatarUrl: true,
						bannerUrl: true,
						userName: true,
					}
				},
			},
			where:
			{
				channelID: dto.channelID
			},
			orderBy:
			{
				createdAt: 'desc'
			},
			skip: dto.offset,
			take: dto.limit
		})

		messages.map((data: Message) => {
			data.mine = (data.senderID == userID);
		})
		return messages;

	}

	async findDmMessages(userID: string, dto: findMessageDto) {
		const messages: Message[] = await this.prismaSerivce.message.findMany({
			include:
			{
				attachment: true,
				sender: {
					select:
					{
						avatarUrl: true,
						bannerUrl: true,
						userName: true,
					}
				},
			},
			where:
			{
				directmessageID: dto.dmID
			},
			orderBy:
			{
				createdAt: 'desc'
			},
			skip: dto.offset,
			take: dto.limit
		})

		messages.map((data: Message) => {
			data.mine = (data.senderID == userID);
		})

		return messages;
	}

	findAll() {
		return this.prismaSerivce.message.findMany()
	}

	findOne(id: string) {
		return this.prismaSerivce.message.findFirst({
			where:
			{
				id: id
			}
		})
	}

	update(id: number, updateMessageDto: UpdateMessageDto) {
		return `This action updates a #${id} message`;
	}

	remove(id: string) {
		return this.prismaSerivce.message.delete({
			where:
			{
				id: id
			}
		})
	}
}
