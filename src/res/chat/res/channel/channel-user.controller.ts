import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ChannelUserService } from './channel-user.service';
import { UpdateChannelUserDto } from './dto/update-channelUser.dto';
import { CreateChannelUserDto } from './dto/create-channelUser.dto';
import { ActiveUser } from 'src/iam/authentication/decorators/active-user.decorator';
import { ActiveUserData } from 'src/iam/interfaces/active-user.interface';
import { JoinChannelDto } from './dto/join-channel.dto';

@Controller('channelUser')
export class ChannelUserController {
	constructor(private readonly channelUserService: ChannelUserService) { }



	@Get()
	findOne(@Body() createChannelUserDto: CreateChannelUserDto) {
		return this.channelUserService.findOne(createChannelUserDto);
	}

	@Post()
	create(@Body() createChannelUserDto: CreateChannelUserDto) {
		return this.channelUserService.create(createChannelUserDto);
	}



	@Post('joinChannel')
	joinChannel(
		@ActiveUser() user: ActiveUserData,
		@Body() joinChannelDto: JoinChannelDto,
	) {
		return this.channelUserService.joinChannel(user.sub, joinChannelDto)
	}

	@Patch()
	update(@Body() updateChannelUserDto: UpdateChannelUserDto) {
		return this.channelUserService.update(updateChannelUserDto);
	}

	@Patch("ban")
	ban(@ActiveUser() user: ActiveUserData, @Body() targetChannelUserDto: UpdateChannelUserDto) {
		return this.channelUserService.channelAction(user.sub, targetChannelUserDto, "BANNED");
	}


	@Patch("mute")
	mute(@ActiveUser() user: ActiveUserData, @Body() targetChannelUserDto: UpdateChannelUserDto) {
		return this.channelUserService.channelAction(user.sub, targetChannelUserDto, "MUTED");
	}

	@Patch("free")
	free(@ActiveUser() user: ActiveUserData, @Body() targetChannelUserDto: UpdateChannelUserDto) {
		return this.channelUserService.channelAction(user.sub, targetChannelUserDto, "FREE");
	}

	@Delete("kick")
	kick(@ActiveUser() user: ActiveUserData, @Body() targetChannelUserDto: UpdateChannelUserDto) {
		return this.channelUserService.kick(user.sub, targetChannelUserDto);
	}

	@Get("myChannels")
	listActiveUserChannels(@ActiveUser() ActiveUser: ActiveUserData) {
		return this.channelUserService.listActiveUserChannels(ActiveUser);
	}
	@Get(':room_id')
	findMember(@ActiveUser() user: ActiveUserData, @Param('room_id') channel_id: string) {
		return this.channelUserService.findMembers(user.sub, channel_id);
	}

}
