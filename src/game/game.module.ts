import { Module } from '@nestjs/common';
import { GameService } from './game.service';
import { StatsService } from './stats.service';
import { ProfileModule } from 'src/res/profile/profile.module';
import { MatchModule } from 'src/res/match/match.module';

@Module({
  exports: [GameService, StatsService],
  providers: [GameService, StatsService],
  imports: [ProfileModule, MatchModule],
})
export class GameModule {}
