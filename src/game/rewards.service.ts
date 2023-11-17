//Could use this for rewards of matches + achievements

import { Injectable } from '@nestjs/common';
import { ProfileService } from 'src/res/profile/profile.service';
import UserData from 'src/res/web-socket/types/user-data.interface';

@Injectable()
export class RewardsService {
  constructor(private readonly profileService: ProfileService) {}

  calculateXpRewards(winner: UserData, loser: UserData, loserScore: number) {
    const winnerXp = 200;
    const loserXp = 100;

    return [winnerXp, loserXp];
  }

  handleLevelUp(player: UserData, XpAfterGame: number) {
    let level = player.profile.level;

    while (XpAfterGame > this.profileService.calculateRequiredXp(level + 1)) {
      level += 1;
    }

    return level;
  }

  calculateCoinsRewards(winner: UserData, loser: UserData, loserScore: number) {
    const winnerCoins = 200;
    const loserCoins = 50;

    return [winnerCoins, loserCoins];
  }

  calculateEloGain(winner: UserData, loser: UserData, loserScore: number) {
    const winnerRating = 100;
    const loserRating = -100;

    return [winnerRating, loserRating];
  }
}
