import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateChannelUserDto } from './dto/update-channelUser.dto';
import { CreateChannelUserDto } from './dto/create-channelUser.dto';
import { $Enums, channelUser } from '@prisma/client';
import { JoinChannelDto } from './dto/join-channel.dto';
import { HashingService } from 'src/hashing/hashing.service';
import { ActiveUserData } from 'src/iam/interfaces/active-user.interface';
import { ChannelUser } from './entities/channel.entity';
import { WebSocketService } from 'src/res/web-socket/services/web-socket.service';

@Injectable()
export class ChannelUserService {
	constructor(
		private prisma: PrismaService,
		private hashingService: HashingService,
		private webSocketService: WebSocketService,
	) { }

	create(createChannelUserDto: CreateChannelUserDto) {
		return this.prisma.channelUser.create({
			data: {
				userID: createChannelUserDto.userID,
				channelID: createChannelUserDto.channelID,
				role: 'MEMBER',
				status: 'FREE',
			},
			include: {
				channel: {
					select: {
						imageUrl: true,
						name: true,
						visibility: true,
					},
				},
				user: {
					select: {
						id: true,
						avatarUrl: true,
						userName: true,
						onlineStatus: true,
					},
				},
			},
		});
	}

	findOne(createChannelUserDto: CreateChannelUserDto) {
		return this.prisma.channelUser.findUnique({
			where: {
				userID_channelID: {
					channelID: createChannelUserDto.channelID,
					userID: createChannelUserDto.userID,
				},
			},
		});
	}

	update(updateChannelUserDto: UpdateChannelUserDto) {
		return this.prisma.channelUser.update({
			where: {
				userID_channelID: {
					channelID: updateChannelUserDto.channelID,
					userID: updateChannelUserDto.userID,
				},
			},
			data: {
				role: updateChannelUserDto.role,
				status: updateChannelUserDto.status,
				duration: updateChannelUserDto.duration,
			},
			select: {
				userID: true,
				user: true,
				channelID: true,
				channel: true,
				duration: true,
				role: true,
				status: true,
				joinedAt: true,
			},
		});
	}

	remove(deleteChannelUserDto: CreateChannelUserDto) {
		return this.prisma.channelUser.delete({
			where: { userID_channelID: deleteChannelUserDto },
		});
	}

	leaveChannel(user_id: string, channel_id: string) {
		return this.prisma.channelUser.deleteMany({
			where: { channelID: channel_id, userID: user_id },
		});
	}

	async channelAction(
		userID: string,
		targetChannelUserDto: UpdateChannelUserDto,
		status: $Enums.channelStatus | undefined = undefined,
	) {
		let actorChannelUserDto: CreateChannelUserDto = {
			channelID: targetChannelUserDto.channelID,
			userID: userID,
		};
		let target_: CreateChannelUserDto = {
			channelID: targetChannelUserDto.channelID,
			userID: targetChannelUserDto.userID,
		};

		const duration = targetChannelUserDto.duration ?? null;
		const promises = [this.findOne(actorChannelUserDto), this.findOne(target_)];
		const [actor, target] = await Promise.all(promises);

		if (target.role != 'OWNER' && actor.role == 'OWNER') {
			target.status = status;
			target.duration = duration
				? Math.round(Date.now() / 1000) + duration
				: duration;
		} else if (actor.role == 'ADMINISTRATOR' && target.role == 'MEMBER') {
			target.status = status;
			target.duration = duration
				? Math.round(Date.now() / 1000) + duration
				: duration;
		} else throw new HttpException('nice try', HttpStatus.FORBIDDEN);

		return this.update(target);
	}

	async kick(userID: string, param: any) {
		let actorChannelUserDto: CreateChannelUserDto = {
			channelID: param.channelID,
			userID: userID,
		};

		let targetChannelUserDto: CreateChannelUserDto = {
			channelID: param.channelID,
			userID: param.userID,
		};

		const promises = [
			this.findOne(actorChannelUserDto),
			this.findOne(targetChannelUserDto),
		];
		const [actor, target] = await Promise.all(promises);

		if (
			target.role == 'OWNER' ||
			(actor.role == 'ADMINISTRATOR' && target.role == 'ADMINISTRATOR')
		)
			throw new HttpException('nice try', 500);
		return this.remove(targetChannelUserDto);
	}

	async joinChannel(userId: string, joinChannelDto: JoinChannelDto) {
		const promises = [];
		const findChannelUserDto: CreateChannelUserDto = {
			channelID: joinChannelDto.channelID,
			userID: userId,
		};

		promises.push(
			this.prisma.channel.findUnique({
				where: { id: joinChannelDto.channelID },
			}),
		);
		promises.push(this.findOne(findChannelUserDto));

		const [targetChannel, targetChannelUser] = await Promise.all(promises);

		if (
			targetChannel.visibility == 'PROTECTED' ||
			(targetChannel.visibility == 'PUBLIC' && targetChannel.password)
		) {
			if (joinChannelDto.password == undefined)
				throw new HttpException('This channel Protected', HttpStatus.FORBIDDEN);

			const validPass = await this.hashingService.compare(
				joinChannelDto.password,
				targetChannel.password,
			);

			if (!validPass)
				throw new HttpException('Invalid password', HttpStatus.FORBIDDEN);
		}

		if (targetChannel.visibility == 'PRIVATE') {
			return 'where is the link?';
		}

		if (
			targetChannelUser &&
			targetChannelUser.duration != 0 &&
			targetChannelUser.duration > Date.now()
		) {
			throw new HttpException(
				`You are ${targetChannelUser.status}, Try again after ${targetChannelUser.duration - Date.now()
				}.`,
				HttpStatus.FORBIDDEN,
			);
		}

		if (targetChannelUser && targetChannelUser.status == 'BANNED') {
			targetChannelUser.status = 'FREE';
			return targetChannelUser;
		}

		const createChannelUserDto: CreateChannelUserDto = {
			channelID: joinChannelDto.channelID,
			userID: userId,
		};

		return this.create(createChannelUserDto);
	}

	async findMembers(
		channel_id: string,
	): Promise<ChannelUser[]> {
		let holder = await this.prisma.channelUser.findMany({
			where: {
				channelID: channel_id,
				OR: [{ status: 'FREE' }],
			},
			include: {
				channel: {
					select: {
						imageUrl: true,
						name: true,
						visibility: true,
					},
				},
				user: {
					select: {
						id: true,
						avatarUrl: true,
						userName: true,
						onlineStatus: true,
						state: true
					},
				},
			},
		});

		holder.map((item) => {
			item.user.onlineStatus = this.webSocketService.isOnline(item.user.id);
			if (item.user.onlineStatus)
				item.user.state = this.webSocketService.getUserState(item.user.id)
		});

		return holder;
	}

	async listBlockedMember(
		user_id: string,
		channel_id: string,
	): Promise<ChannelUser[]> {
		return this.prisma.channelUser.findMany({
			where: {
				channelID: channel_id,
				status: 'BANNED',
			},
			include: {
				user: {
					select: {
						id: true,
						avatarUrl: true,
						userName: true,
						onlineStatus: true,
					},
				},
			},
		});
	}

	async listActiveUserChannels(activeUser: ActiveUserData) {
		let rooms = await this.prisma.channelUser.findMany({
			select: {
				channelID: true,
			},
			where: {
				userID: activeUser.sub,
				NOT: { status: 'BANNED' },
			},
		});

		return rooms.map((data) => data.channelID);
	}
}
