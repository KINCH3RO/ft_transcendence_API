import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './services/prisma/prisma.service';
import { ProfileModule } from './profile/profile.module';
import { FriendModule } from './friend/friend.module';
import { AchievementModule } from './achievement/achievement.module';
import { MatchesModule } from './matches/matches.module';
import { ChatModule } from './chat/chat.module';
import { NotificationModule } from './notification/notification.module';

@Module({
  imports: [ProfileModule, FriendModule, AchievementModule, MatchesModule, ChatModule, NotificationModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
