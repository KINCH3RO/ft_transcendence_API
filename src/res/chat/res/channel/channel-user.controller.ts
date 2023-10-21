import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ChannelUserService } from './channel-user.service';
import { UpdateChannelUserDto } from './dto/update-channelUser.dto';
import { CreateChannelUserDto } from './dto/create-channelUser.dto';
import { ActiveUser } from 'src/iam/authentication/decorators/active-user.decorator';
import { ActiveUserData } from 'src/iam/interfaces/active-user.interface';

@Controller('channelUser')
export class ChannelUserController {
	constructor(private readonly channelUserService: ChannelUserService) {}

  @Get()
  findOne(@Body() createChannelUserDto: CreateChannelUserDto) {
    return this.channelUserService.findOne(createChannelUserDto);
  }

  @Post()
  create(@Body() createChannelUserDto: CreateChannelUserDto) {
    return this.channelUserService.create(createChannelUserDto);
  }

  @Patch()
  update(@Body() updateChannelUserDto: UpdateChannelUserDto) {
    return this.channelUserService.update(updateChannelUserDto);
  }

  @Patch("ban")
  ban(@ActiveUser() user: ActiveUserData, @Body() targetChannelUserDto: CreateChannelUserDto) {
    return this.channelUserService.ban(user.sub, targetChannelUserDto, "BANNED");
  }

  @Delete("kick")
  kick(@ActiveUser() user: ActiveUserData, @Body() targetChannelUserDto: CreateChannelUserDto) {
    return this.channelUserService.kick(user.sub, targetChannelUserDto);
  }


}
