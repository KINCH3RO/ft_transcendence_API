import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ChannelService } from './channel.service';
import { CreateChannelDto } from './dto/create-channel.dto';
import { UpdateChannelDto } from './dto/update-channel.dto';
import { ActiveUser } from 'src/iam/authentication/decorators/active-user.decorator';
import { ActiveUserData } from 'src/iam/interfaces/active-user.interface';

@Controller('channel')
export class ChannelController {
  constructor(private readonly channelService: ChannelService) {}

  @Post()
  create(@ActiveUser() user:ActiveUserData, @Body() createChannelDto: CreateChannelDto) {
    return this.channelService.create(createChannelDto, user.sub);
  }

  @Get()
  findAll() {
    return this.channelService.findAll();
  }

  @Get("filter")
  findChannelByName(@Query('name') name: string) {
    return this.channelService.findChannelByName(name);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.channelService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateChannelDto: UpdateChannelDto) {
    return this.channelService.update(id, updateChannelDto);
  }

  @Delete(':id')
  remove(@ActiveUser() user: ActiveUserData, @Param('id') id: string) {
    return this.channelService.remove(user.sub, id);
  }
}
