import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateChannelDto } from './dto/create-channel.dto';
import { UpdateChannelDto } from './dto/update-channel.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { channelUser } from '@prisma/client';
import { HashingService } from 'src/hashing/hashing.service';
import { WebSocketService } from 'src/res/web-socket/services/web-socket.service';
import { Channel } from './entities/channel.entity';
import { UpdatePasswordDto } from './dto/update-password.dto';

@Injectable()
export class ChannelService {
	constructor(
		private prisma: PrismaService,
		private hashingService: HashingService,
		private webSocketService: WebSocketService,
	) { }

	async create(createChannelDto: CreateChannelDto, id: string) {
		let room: any = await this.prisma.channel.create({
			select: {
				id: true,
				name: true,
				imageUrl: true,
				visibility: true,
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
				channels: true,
			},
			data: {
				imageUrl: createChannelDto.imageUrl,
				name: createChannelDto.name,
				visibility: createChannelDto.visibility,
				password: createChannelDto.password
					? await this.hashingService.hash(createChannelDto.password)
					: null,
				channels: {
					create: {
						userID: id,
						role: 'OWNER',
						status: 'FREE',
					},
				},
				message: {},
			},
		});

		room['isMemeber'] = true;
		room['owner'] = 'OWNER';

		return room;
	}

	findAll() {
		return this.prisma.channel.findMany();
	}

	async findOne(id: string) {
		const channel = await this.prisma.channel.findUnique({
			where: { id },
			select: {
				id: true,
				visibility: true,
				name: true,
				imageUrl: true,
				channels: {
					select: {
						user: {
							select: {
								id: true,
								onlineStatus: true,
							},
						},
						status: true,
						role: true,
						duration: true,
					},
				},
			},
		});
		if (!channel)
			throw new HttpException("Not Found", HttpStatus.NOT_FOUND)

		channel.channels.map((item) => {
			item.user.onlineStatus = this.webSocketService.isOnline(item.user.id);
			item["muteDuration"] = item.duration
			item['role'] = item.role;
		});

		return channel;
	}

	update(updateChannelDto: UpdateChannelDto) {
		return this.prisma.channel.update({
			where: { id: updateChannelDto.id },
			data: updateChannelDto,
		});
	}

	async updatePassword(updatePasswordDto: UpdatePasswordDto) {
		let channel = await this.prisma.channel.findUnique({
			where: { id: updatePasswordDto.id },
			select: {
				password: true,
				visibility: true,
			},
		});

		if (channel.visibility == 'PROTECTED' && updatePasswordDto.oldPass) {
			let validpass = await this.hashingService.compare(
				updatePasswordDto.oldPass,
				channel.password,
			);
			if (!validpass)
				throw new HttpException('wrong password', HttpStatus.FORBIDDEN);
		}

		let pass = null;
		if (updatePasswordDto.newPassword)
			pass = await this.hashingService.hash(updatePasswordDto.newPassword);

		return this.prisma.channel.update({
			where: { id: updatePasswordDto.id },
			data: { password: pass, visibility: updatePasswordDto.visibility },
		});
	}

	async remove(userId: string, channelId: string) {
		const actor: channelUser = await this.prisma.channelUser.findUnique({
			where: {
				userID_channelID: { channelID: channelId, userID: userId },
			},
		});

		if (actor && actor.role != 'OWNER')
			throw new HttpException('Nice try', HttpStatus.FORBIDDEN);

		const deleteMessages = this.prisma.message.deleteMany({
			where: { channelID: channelId },
		});
		const deleteUsers = this.prisma.channelUser.deleteMany({
			where: { channelID: channelId },
		});
		const deleteChannel = this.prisma.channel.delete({
			where: { id: channelId },
		});

		return this.prisma.$transaction([
			deleteMessages,
			deleteUsers,
			deleteChannel,
		]);
	}

	async findChannelByName(currentUserId: string, name: string) {
		let list: any = await this.prisma.channel.findMany({
			take: 20,
			where: {
				name: { startsWith: name, mode: 'insensitive' },
				visibility: { not: 'PRIVATE' },
				channels: {
					none: {
						status: 'BANNED',
					},
				},
			},
			select: {
				id: true,
				name: true,
				imageUrl: true,
				visibility: true,
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
				channels: {
					where: {
						userID: currentUserId
					}
				},
			},
		});

		list.map((item) => {
			let channel_user: channelUser = item.channels.find((x) => x.userID == currentUserId);
			if (channel_user) {
				item["muteDuration"] = channel_user.duration;
				item['isMemeber'] = true;
				item['role'] = channel_user.role;
			} else item['isMemeber'] = false;
		});

		return list;
	}

	async listCurrentUserChannel(currentUserId: string) {
		let list: any = await this.prisma.channel.findMany({
			where: {
				channels: {
					some: { userID: currentUserId, status: { not: 'BANNED' } },
				},
			},
			select: {
				id: true,
				name: true,
				imageUrl: true,
				visibility: true,
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
				channels: {
					where: {
						userID: currentUserId
					}
				},
			},
		});


		list.map((item) => {
			let channel_user: channelUser = item.channels.find((x) => x.userID == currentUserId);

			if (channel_user) {
				item["muteDuration"] = channel_user.duration;
				item['isMemeber'] = true;
				item['role'] = channel_user.role;
			} else item['isMemeber'] = false;
		});

		return list;
	}
}
