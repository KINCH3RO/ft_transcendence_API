import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { DirectMessageService } from './direct-message.service';
import { CreateDirectMessageDto } from './dto/create-direct-message.dto';
import { UpdateDirectMessageDto } from './dto/update-direct-message.dto';

@Controller('direct-message')
export class DirectMessageController {
  constructor(private readonly directMessageService: DirectMessageService) {}

  @Post()
  create(@Body() createDirectMessageDto: CreateDirectMessageDto) {
    return this.directMessageService.create(createDirectMessageDto);
  }

  @Get()
  findAll() {
    return this.directMessageService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.directMessageService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDirectMessageDto: UpdateDirectMessageDto) {
    return this.directMessageService.update(+id, updateDirectMessageDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.directMessageService.remove(+id);
  }
}
