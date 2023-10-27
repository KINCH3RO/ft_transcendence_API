import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { DirectMessageService } from './direct-message.service';
import { ActiveUser } from 'src/iam/authentication/decorators/active-user.decorator';
import { ActiveUserData } from 'src/iam/interfaces/active-user.interface';

@Controller('directMessage')
export class DirectMessageController {
	constructor(private readonly directMessageService: DirectMessageService) { }

	@Post(':receiverId')
	create(@ActiveUser() user: ActiveUserData, @Param('receiverId') rec: string) {
		return this.directMessageService.create(user.sub, rec);
	}

	@Get()
	findAll(@ActiveUser() user: ActiveUserData) {
		return this.directMessageService.findYourDM(user.sub);
	}

	@Get('list')
  listDM(@ActiveUser() user: ActiveUserData) {
    return this.directMessageService.listCurrentDM(user.sub)
  }

	@Delete(':DmId')
	remove(@Param('DmId') id: string) {
		return this.directMessageService.remove(id);
	}
}
