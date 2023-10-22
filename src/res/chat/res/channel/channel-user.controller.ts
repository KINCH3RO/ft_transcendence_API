import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ChannelUserService } from './channel-user.service';
import { UpdateChannelUserDto } from './dto/update-channelUser.dto';
import { CreateChannelUserDto } from './dto/create-channelUser.dto';
import { ActiveUser } from 'src/iam/authentication/decorators/active-user.decorator';
import { ActiveUserData } from 'src/iam/interfaces/active-user.interface';
import { JoinChannelDto } from './dto/join-channel.dto';

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

  @Get(':channelId')
  joinChannel(
    @ActiveUser() user: ActiveUserData,
    @Param('channelId') channelId: string,
    @Body() joinChannelDto: JoinChannelDto,
  ) {
    return this.channelUserService.joinChannel(user.sub, channelId, joinChannelDto)
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
