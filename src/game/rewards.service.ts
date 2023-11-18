//Could use this for rewards of matches + achievements

import { Injectable } from '@nestjs/common';
import { ProfileService } from 'src/res/profile/profile.service';
import UserData from 'src/res/web-socket/types/user-data.interface';

@Injectable()
export class RewardsService {
  constructor(private readonly profileService: ProfileService) {}

  calculateXpRewards(winner: UserData, loser: UserData, loserScore: number) {
    let winnerXp = 600;
    const loserXp = 400;

    if (loserScore < 3) winnerXp += 50;

    return [winnerXp, loserXp];
  }

  handleLevelUp(player: UserData, XpAfterGame: number) {
    let level = player.profile.level;

    while (XpAfterGame >= this.profileService.calculateRequiredXp(level + 1)) {
      level += 1;
    }

    return level;
  }

  calculateCoinsRewards(winner: UserData, loser: UserData, loserScore: number) {
    let winnerCoins = 100;
    const loserCoins = 40;

    if (loserScore < 3) winnerCoins += 50;

    return [winnerCoins, loserCoins];
  }

  calculateEloGain(winner: UserData, loser: UserData) {
    const sensitivity = 50;
    const minRp = 15;

    const EWinner =
      1 /
      (1 +
        Math.pow(
          10,
          (loser.profile.rating - winner.profile.rating) / sensitivity,
        ));

    const ELoser =
      1 /
      (1 +
        Math.pow(
          10,
          (winner.profile.rating - loser.profile.rating) / sensitivity,
        ));

    const winnerRating = Math.floor(sensitivity * (1 - EWinner)) + minRp;
    const loserRating = Math.floor(sensitivity * -ELoser) + 1 - minRp;

    return [winnerRating, loserRating];
  }
}
