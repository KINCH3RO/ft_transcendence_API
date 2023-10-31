import { Module } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { ProfileController } from './profile.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { profile } from 'console';

@Module({
	controllers: [ProfileController],
	providers: [ProfileService],
	imports: [PrismaModule],
	exports: [ProfileService]
})
export class ProfileModule { }
