import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';
import { ActiveUser } from './iam/authentication/decorators/active-user.decorator';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService , private prismaService:PrismaService) {}

  @Get()
  getHello(@ActiveUser() user): string {
    return user;
  }
}
