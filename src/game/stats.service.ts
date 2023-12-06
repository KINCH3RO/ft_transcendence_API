import { Injectable } from '@nestjs/common';
import { MatchService } from 'src/res/match/match.service';
import { ProfileService } from 'src/res/profile/profile.service';
import Lobby from 'src/res/web-socket/types/lobby.interface';
import { RewardsService } from './rewards.service';
import { AchievementService } from 'src/res/achievement/achievement.service';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class StatsService {
  constructor(
    private matchService: MatchService,
    private profileService: ProfileService,
    private rewardsService: RewardsService,
    private achievementService: AchievementService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async saveGame(lobby: Lobby) {
    const loserScore =
      lobby.gameData.score[0] == 5
        ? lobby.gameData.score[1]
        : lobby.gameData.score[0];

    const winner =
      lobby.gameData.score[0] == 5 ? lobby.players[0] : lobby.players[1];

    const loser =
      lobby.gameData.score[1] == 5 ? lobby.players[0] : lobby.players[1];

    let [winnerFirstGameAch, loserFirstGameAch] = [null, null];

    [winnerFirstGameAch] = await this.eventEmitter.emitAsync('user.firstGame', {
      id: winner.id,
    });
    [loserFirstGameAch] = await this.eventEmitter.emitAsync('user.firstGame', {
      id: loser.id,
    });

    const [winnerXp, loserXp] = this.rewardsService.calculateXpRewards(
      winner,
      loser,
      loserScore,
    );

    const [winnerCoins, loserCoins] = this.rewardsService.calculateCoinsRewards(
      winner,
      loser,
      loserScore,
    );

    const [winnerRating, loserRating, ratingAchievement] =
      await this.rewardsService.calculateEloGain(winner, loser);

    const matchPromise = this.matchService.create({
      loserID: loser.id,
      winnerID: winner.id,
      ranked: lobby.ranked,
      gameMode: lobby.mode,
      loserScore,
      duration: lobby.gameData.timer,
    });

    const [winnerLevel, winnerAchievement] =
      await this.rewardsService.handleLevelUp(
        winner,
        winner.profile.xp + winnerXp,
      );

    const [loserLevel, loserAchievement] =
      await this.rewardsService.handleLevelUp(
        loser,
        loser.profile.xp + loserXp,
      );

    const winnerPromise = this.profileService.update(winner.id, {
      rating: winner.profile.rating + (lobby.ranked ? winnerRating : 0),
      coins: winner.profile.coins + winnerCoins,
      xp: winner.profile.xp + winnerXp,
      level: winnerLevel,
    });

    const loserPromise = this.profileService.update(loser.id, {
      rating: loser.profile.rating + (lobby.ranked ? loserRating : 0),
      coins: loser.profile.coins + loserCoins,
      xp: loser.profile.xp + loserXp,
      level: loserLevel,
    });

    let aceAchievement = null;
    if (loserScore === 0) {
      aceAchievement = await this.achievementService.assign(winner.id, {
        id: 0,
        name: 'ace',
      });
    }

    const players = [lobby.players[0], lobby.players[1]];
    const achievementsPlayer = [
      lobby.gameData.achievements[0],
      lobby.gameData.achievements[1],
    ];

    let gravityAchievement = null;
    let deleteAchievement = null;

    if (
      achievementsPlayer[0].imperturbable ||
      achievementsPlayer[1].imperturbable
    ) {
      gravityAchievement = await this.achievementService.assign(winner.id, {
        id: 2,
        name: 'Imperturbable',
      });
    }
    if (achievementsPlayer[0].deleteGame || achievementsPlayer[1].deleteGame) {
      deleteAchievement = await this.achievementService.assign(loser.id, {
        id: 4,
        name: 'Delete the game',
      });
    }

    const stunnedSpeedyAchievements = [
      { stunned: null, speedy: null },
      { stunned: null, speedy: null },
    ];

    if (achievementsPlayer[0].stunnedSavior)
      stunnedSpeedyAchievements[0].stunned =
        await this.achievementService.assign(players[0].id, {
          id: 1,
          name: 'Stunned Savior',
        });

    if (achievementsPlayer[0].speedySlipup)
      stunnedSpeedyAchievements[0].speedy =
        await this.achievementService.assign(players[0].id, {
          id: 3,
          name: 'Speedy Slip-Up',
        });

    if (achievementsPlayer[1].stunnedSavior)
      stunnedSpeedyAchievements[1].stunned =
        await this.achievementService.assign(players[1].id, {
          id: 1,
          name: 'Stunned Savior',
        });

    if (achievementsPlayer[1].speedySlipup)
      stunnedSpeedyAchievements[1].speedy =
        await this.achievementService.assign(players[1].id, {
          id: 3,
          name: 'Speedy Slip-Up',
        });

    await Promise.all([matchPromise, winnerPromise, loserPromise]);
    return [
      {
        id: winner.id,
        xp: winnerXp,
        coins: winnerCoins,
        rating: winnerRating,
        achievements: [
          winnerAchievement,
          ratingAchievement,
          aceAchievement,
          gravityAchievement,
          stunnedSpeedyAchievements[players[0].id === winner.id ? 0 : 1].speedy,
          stunnedSpeedyAchievements[players[0].id === winner.id ? 0 : 1]
            .stunned,
          winnerFirstGameAch,
        ],
      },
      {
        id: loser.id,
        xp: loserXp,
        coins: loserCoins,
        rating: loserRating,
        achievements: [
          loserAchievement,
          deleteAchievement,
          stunnedSpeedyAchievements[players[0].id === loser.id ? 0 : 1].speedy,
          stunnedSpeedyAchievements[players[0].id === loser.id ? 0 : 1].stunned,
          loserFirstGameAch,
        ],
      },
    ];
  }
}
