import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './services/prisma/prisma.service';
import { ProfileModule } from './res/profile/profile.module';
import { FriendModule } from './res/friend/friend.module';
import { AchievementModule } from './res/achievement/achievement.module';
import { MatchesModule } from './res/matches/matches.module';
import { ChatModule } from './res/chat/chat.module';
import { NotificationModule } from './res/notification/notification.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { IamModule } from './iam/iam.module';
import { UsersModule } from './res/users/users.module';
@Module({
	imports: [ServeStaticModule.forRoot({
		rootPath: join(__dirname, '..', 'public'),
		renderPath:"",
	}), ProfileModule, FriendModule, AchievementModule, MatchesModule, ChatModule, NotificationModule, IamModule, UsersModule],
	controllers: [AppController],
	providers: [AppService, PrismaService],
})
export class AppModule { }


