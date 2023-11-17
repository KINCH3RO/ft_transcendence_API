import { Injectable } from '@nestjs/common';
import { MatchService } from 'src/res/match/match.service';
import { ProfileService } from 'src/res/profile/profile.service';
import Lobby from 'src/res/web-socket/types/lobby.interface';
import { RewardsService } from './rewards.service';

@Injectable()
export class StatsService {
  constructor(
    private matchService: MatchService,
    private profileService: ProfileService,
    private rewardsService: RewardsService,
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

    const [winnerRating, loserRating] = this.rewardsService.calculateEloGain(
      winner,
      loser,
      loserScore,
    );

    const matchPromise = this.matchService.create({
      loserID: loser.id,
      winnerID: winner.id,
      ranked: lobby.ranked,
      gameMode: 'CLASSIC',
      loserScore,
      duration: 200,
    });

    const winnerPromise = this.profileService.update(winner.id, {
      rating: winner.profile.rating + (lobby.ranked ? winnerRating : 0),
      coins: winner.profile.coins + winnerCoins,
      xp: winner.profile.xp + winnerXp,
      level: this.rewardsService.handleLevelUp(
        winner,
        winner.profile.xp + loserXp,
      ),
    });

    const loserPromise = this.profileService.update(loser.id, {
      rating: loser.profile.rating + (lobby.ranked ? loserRating : 0),
      coins: loser.profile.coins + loserCoins,
      xp: loser.profile.xp + loserXp,
      level: this.rewardsService.handleLevelUp(
        loser,
        loser.profile.xp + loserXp,
      ),
    });
    await Promise.all([matchPromise, winnerPromise, loserPromise]);
  }
}
