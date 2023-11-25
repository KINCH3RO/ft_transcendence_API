import { Module } from '@nestjs/common';
import { GameService } from './game.service';
import { StatsService } from './stats.service';
import { ProfileModule } from 'src/res/profile/profile.module';
import { MatchModule } from 'src/res/match/match.module';
import { RewardsService } from './rewards.service';
import { AchievementModule } from 'src/res/achievement/achievement.module';

@Module({
  exports: [GameService, StatsService, RewardsService],
  providers: [GameService, StatsService, RewardsService],
  imports: [ProfileModule, MatchModule, AchievementModule],
})
export class GameModule {}
