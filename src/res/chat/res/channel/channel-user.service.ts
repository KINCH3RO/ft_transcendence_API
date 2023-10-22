import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateChannelUserDto } from './dto/update-channelUser.dto';
import { CreateChannelUserDto } from './dto/create-channelUser.dto';
import { $Enums, channel } from '@prisma/client';
import { JoinChannelDto } from './dto/join-channel.dto';
import { HashingService } from 'src/iam/hashing/hashing.service';
import { join } from 'path';

@Injectable()
export class ChannelUserService {
  constructor(
    private prisma: PrismaService,
    private hashingService: HashingService,
  ) {}

  create(createChannelUserDto: CreateChannelUserDto) {
    return this.prisma.channelUser.create({
      data: {
        userID: createChannelUserDto.userID,
        channelID: createChannelUserDto.channelID,
        role: 'MEMBER',
        status: 'FREE',
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
      },
    });
  }

  remove(deleteChannelUserDto: CreateChannelUserDto) {
    return this.prisma.channelUser.delete({
      where: { userID_channelID: deleteChannelUserDto },
    });
  }

  async ban(
    userID: string,
    targetChannelUserDto: CreateChannelUserDto,
    status: $Enums.channelStatus,
  ) {
    let actorChannelUserDto: CreateChannelUserDto = {
      channelID: targetChannelUserDto.channelID,
      userID: userID,
    };

    const promises = [];

    promises.push(this.findOne(actorChannelUserDto));
    promises.push(this.findOne(targetChannelUserDto));

    const [actor, target] = await Promise.all(promises);

    if (target.role != 'OWNER' && actor.role == 'OWNER') target.status = status;
    else if (actor.role == 'ADMINISTRATOR' && target.role == 'MEMBER')
      target.status = status;
    else throw new HttpException('nice try', 500);

    return this.update(target);
  }

  async kick(userID: string, targetChannelUserDto: CreateChannelUserDto) {
    let actorChannelUserDto: CreateChannelUserDto = {
      channelID: targetChannelUserDto.channelID,
      userID: userID,
    };

    const promises = [];

    promises.push(this.findOne(actorChannelUserDto));
    promises.push(this.findOne(targetChannelUserDto));

    const [actor, target] = await Promise.all(promises);

    if (
      target.role == 'OWNER' ||
      (actor.role == 'ADMINISTRATOR' && target.role == 'ADMINISTRATOR')
    )
      throw new HttpException('nice try', 500);
    return this.remove(targetChannelUserDto);
  }

  async joinChannel(
    userId: string,
    channelId: string,
    joinChannelDto: JoinChannelDto,
  ) {

    const targetChannel: channel = await this.prisma.channel.findUnique({
      where: { id: channelId },
    });

    if (targetChannel.visibility == 'PROTECTED')
    {
      if (joinChannelDto.password == undefined)
        throw new HttpException('This channel Protected', HttpStatus.FORBIDDEN);

      const validPass = await this.hashingService.compare(joinChannelDto.password, targetChannel.password)

      if (!validPass)
        throw new HttpException('Invalid password', HttpStatus.FORBIDDEN);
    }

    if (targetChannel.visibility == 'PRIVATE')
    {
      return 'where is the link?'
    }

    const createChannelUserDto: CreateChannelUserDto = {
      channelID: channelId,
      userID: userId,
    };

    return this.create(createChannelUserDto);
  }
}
