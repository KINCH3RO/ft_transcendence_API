import { Injectable } from '@nestjs/common';
import { MatchService } from 'src/res/match/match.service';
import { ProfileService } from 'src/res/profile/profile.service';
import Lobby from 'src/res/web-socket/types/lobby.interface';

@Injectable()
export class StatsService {
  constructor(
    private matchService: MatchService,
    private profileService: ProfileService,
  ) {
    this.winnerXp = 200;
    this.loserXp = 100;
    this.winnerCoins = 200;
    this.loserCoins = 50;
    this.winnerRating = 100;
    this.loserRating = -100;
  }

  private winnerXp;
  private loserXp;
  private winnerCoins;
  private loserCoins;
  private winnerRating;
  private loserRating;

  async saveGame(lobby: Lobby) {
    let loserScore =
      lobby.gameData.score[0] == 5
        ? lobby.gameData.score[1]
        : lobby.gameData.score[0];

    const winner =
      lobby.gameData.score[0] == 5 ? lobby.players[0] : lobby.players[1];

    const loser =
      lobby.gameData.score[1] == 5 ? lobby.players[0] : lobby.players[1];

    const matchPromise = this.matchService.create({
      loserID: loser.id,
      winnerID: winner.id,
      ranked: lobby.ranked,
      gameMode: 'CLASSIC',
      loserScore,
    });

    const winnerPromise = this.profileService.update(winner.id, {
      rating: winner.profile.rating + (lobby.ranked ? this.winnerRating : 0),
      coins: winner.profile.coins + this.winnerCoins,
      xp: winner.profile.xp + this.winnerXp,
    });

    const loserPromise = this.profileService.update(loser.id, {
      rating: loser.profile.rating + +(lobby.ranked ? this.loserRating : 0),
      coins: loser.profile.coins + this.loserCoins,
      xp: loser.profile.xp + this.loserXp,
    });
    await Promise.all([matchPromise, winnerPromise, loserPromise]);
  }
}
