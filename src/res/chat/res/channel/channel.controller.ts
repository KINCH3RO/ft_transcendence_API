import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ChannelService } from './channel.service';
import { CreateChannelDto } from './dto/create-channel.dto';
import { UpdateChannelDto } from './dto/update-channel.dto';
import { ActiveUser } from 'src/iam/authentication/decorators/active-user.decorator';
import { ActiveUserData } from 'src/iam/interfaces/active-user.interface';

@Controller('channel')
export class ChannelController {
	constructor(private readonly channelService: ChannelService) { }

	@Post()
	create(@ActiveUser() user: ActiveUserData, @Body() createChannelDto: CreateChannelDto) {
		return this.channelService.create(createChannelDto, user.sub);
	}

	@Get()
	findAll() {
		return this.channelService.findAll();
	}

	@Get('list')
	listChannel(@ActiveUser() user: ActiveUserData) {
		return this.channelService.listCurrentUserChannel(user.sub)
	}

	@Get("filter")
	findChannelByName(@ActiveUser() user: ActiveUserData, @Query('name') name: string) {
		return this.channelService.findChannelByName(user.sub, name);
	}

	@Get(':id')
	findOne(@Param('id') id: string) {
		return this.channelService.findOne(id);
	}

	@Patch()
	update(@Body() updateChannelDto: UpdateChannelDto) {
		return this.channelService.update(updateChannelDto);
	}

	@Delete()
	remove(@ActiveUser() user: ActiveUserData, @Body() removeChannelDto: UpdateChannelDto) {
		return this.channelService.remove(user.sub, removeChannelDto);
	}
}
