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

@Module({
  imports: [ProfileModule, FriendModule, AchievementModule, MatchesModule, ChatModule, NotificationModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
