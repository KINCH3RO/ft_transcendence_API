import { Injectable } from '@nestjs/common';
import { AchievementService } from 'src/res/achievement/achievement.service';
import { ProfileService } from 'src/res/profile/profile.service';
import UserData from 'src/res/web-socket/types/user-data.interface';

@Injectable()
export class RewardsService {
  constructor(
    private readonly profileService: ProfileService,
    private readonly achievementService: AchievementService,
  ) {}

  calculateXpRewards(loserScore: number) {
    let winnerXp = 600;
    const loserXp = 400;

    if (loserScore < 3) winnerXp += 50;

    return [winnerXp, loserXp];
  }

  async handleLevelUp(player: UserData, XpAfterGame: number) {
    let level = player.profile.level;
    let achievement = null;

    while (XpAfterGame >= this.profileService.calculateRequiredXp(level + 1)) {
      level += 1;
      if (level === 20) {
        achievement = await this.achievementService.assign(player.id, {
          id: 8,
          name: 'General',
        });
      }
      if (level === 50) {
        achievement = await this.achievementService.assign(player.id, {
          id: 9,
          name: 'Veteran',
        });
      }
    }

    return [level, achievement];
  }

  calculateCoinsRewards(loserScore: number) {
    let winnerCoins = 100;
    const loserCoins = 40;

    if (loserScore < 3) winnerCoins += 50;

    return [winnerCoins, loserCoins];
  }

  async calculateEloGain(winner: UserData, loser: UserData) {
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

    let achievement = null;
    if (winner.profile.rating + winnerRating > 1000)
      achievement = await this.achievementService.assign(winner.id, {
        id: 5,
        name: 'Ascendant',
      });
    if (winner.profile.rating + winnerRating > 2000)
      achievement = await this.achievementService.assign(winner.id, {
        id: 6,
        name: 'Expert',
      });
    if (winner.profile.rating + winnerRating > 5000)
      achievement = await this.achievementService.assign(winner.id, {
        id: 7,
        name: 'Legendary',
      });

    return [winnerRating, loserRating, achievement];
  }
}
