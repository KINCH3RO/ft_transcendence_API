import { Controller, Get, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';
import { ActiveUser } from './iam/authentication/decorators/active-user.decorator';
import { Public } from './iam/authentication/decorators/public.decorator';
import { readdir, readdirSync } from 'fs';

@Controller()
export class AppController {
	constructor(
		private readonly appService: AppService,
		private prismaService: PrismaService,
	) { }


	getRandomImage(dir: string) {
		let files;
		let dirPath = process.cwd() + dir;
		try {
			files = readdirSync(dirPath)
		} catch (error) {
			return ""
		}
		let imageExtensions = ['png', 'jpg', 'jpeg', 'gif'];
		files = files.filter(file => imageExtensions.includes(file.split(".").pop()));
		if (files.length <= 0)
			return "";
		const randomIndex = Math.floor(Math.random() * files.length)
		return process.env.URL_PREFIX + dir.replace("/public", "") + "/" + files[randomIndex]
	}
	@Get()
	@Public()
	getHello(): string {

		return this.getRandomImage("/public/assets/banners")
	}

}
