import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
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
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
      renderPath: 'none',
    }),
    ProfileModule,
    FriendModule,
    AchievementModule,
    MatchesModule,
    ChatModule,
    NotificationModule,
    IamModule,
    UsersModule,
    PrismaModule,
    ConfigModule.forRoot({ isGlobal: true }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
