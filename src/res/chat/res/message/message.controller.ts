import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException, HttpStatus, Query } from '@nestjs/common';
import { MessageService } from './message.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { ActiveUser } from 'src/iam/authentication/decorators/active-user.decorator';
import { ActiveUserData } from 'src/iam/interfaces/active-user.interface';
import { findMessageDto } from './dto/find-message.dto';

@Controller('message')
export class MessageController {
	constructor(private readonly messageService: MessageService) { }

	@Post()
	sendMessage(@ActiveUser() activeUser: ActiveUserData, @Body() createMessageDto: CreateMessageDto) {



		if (createMessageDto.dmMessage && !createMessageDto.directmessageID)
			throw new HttpException("DM identifier is Empty", HttpStatus.FORBIDDEN);
		if (!createMessageDto.dmMessage && !createMessageDto.channelID)
			throw new HttpException("channel identifier is Empty", HttpStatus.FORBIDDEN);
		return this.messageService.create(activeUser.sub, createMessageDto);
	}


	@Get()
	findMessages(@ActiveUser() activeUser: ActiveUserData, @Query() dto: findMessageDto) {

		if (!dto.dmID && !dto.channelID)
			throw new HttpException("", HttpStatus.BAD_REQUEST);
		if (dto.channelID && dto.channelID)
			throw new HttpException("", HttpStatus.BAD_REQUEST);
		if (dto.dmID)
			return this.messageService.findDmMessages(activeUser.sub, dto);
		else
			return this.messageService.findChannelMessages(activeUser.sub, dto);


	}

	@Get(':id')
	findOne(@Param('id') id: string) {
		return this.messageService.findOne(id);
	}

	@Patch(':id')
	update(@Param('id') id: string, @Body() updateMessageDto: UpdateMessageDto) {
		return this.messageService.update(+id, updateMessageDto);
	}

	@Delete(':id')
	remove(@Param('id') id: string) {
		return this.messageService.remove(id);
	}
}
