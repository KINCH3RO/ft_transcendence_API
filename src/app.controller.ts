import { Controller, Get, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';
import { ActiveUser } from './iam/authentication/decorators/active-user.decorator';
import { Public } from './iam/authentication/decorators/public.decorator';

@Controller()
export class AppController {
	constructor(
		private readonly appService: AppService,
		private prismaService: PrismaService,
	) { }

	@Get()
	@Public()
	getHello(@Res() res): string {
		return res.redirect('https://www.google.com/');
	}
}
