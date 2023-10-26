import { Injectable } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class MessageService {
	constructor(private prismaSerivce: PrismaService) {

	}
	create(userID: string, createMessageDto: CreateMessageDto) {
		return this.prismaSerivce.message.create({
			include:
				{ attachment: true },
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
	}

	findAll() {
		return `This action returns all message`;
	}

	findOne(id: number) {
		return `This action returns a #${id} message`;
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
