import { Injectable } from '@nestjs/common';
import Lobby, { GameData, LobbyCreate } from '../types/lobby.interface';
import { randomUUID } from 'crypto';
import { ProfileService } from 'src/res/profile/profile.service';
import UserData from '../types/user-data.interface';
import { GameMode } from '../types/game-mode.interface';
import GraviraSpawner from '../gamemodes/gravira/spawner';
import SpellWeaverEntity from '../gamemodes/magician/spellweaver';

@Injectable()
export class LobbyService {
  constructor(private profileService: ProfileService) {}
  lobbies: Lobby[] = [];

  async createLobby({
    players,
    mode = 'Normal',
    queueLobby = false,
    ranked = false,
    lobbySate = 'idle',
  }: LobbyCreate) {
    if (this.isPlayerOnLobby(players[0]) || this.isPlayerOnLobby(players[1]))
      throw 'already exist';
    const user1: UserData = await this.profileService.findDataByUserId(
      players[0],
    );
    const user2: UserData = await this.profileService.findDataByUserId(
      players[1],
    );
    const createdLobby: Lobby = {
      id: randomUUID(),
      players: [user1, user2],
      mode: mode,
      queueLobby: queueLobby,
      owner: players[0],
      ranked: ranked,
      lobbySate: lobbySate,
      isOwner: false,
      gameData: this.initGameData(mode),
      gameInterval: null,
    };
    this.lobbies.push(createdLobby);
    return createdLobby;
  }

  initGameData(mode: GameMode): GameData {
    const data: GameData = {
      paddle1: {
        x: 0,
        y: 40,
        mana: null,
        isCasting: false,
        isStunned: false,
        isUP: false,
        isDown: false,
        numberPressed: null,
        height: 20,
        speed: 2,
        castDuration: 0,
        stunDuration: 0,
        homingStunOrbs: [],
      },
      paddle2: {
        x: 99,
        y: 40,
        mana: null,
        isCasting: false,
        isStunned: false,
        isUP: false,
        isDown: false,
        numberPressed: null,
        height: 20,
        speed: 2,
        castDuration: 0,
        stunDuration: 0,
        homingStunOrbs: [],
      },
      ball: {
        x: 50,
        y: 50,
        xDirection: 1,
        yDirection: 1,
        xSpeed: 0.5,
        ySpeed: 1.5,
      },
      score: [0, 0],
      scoreUpdated: false,
      resourcesUpdated: false,
      gameStartDate: NaN,
    };

    switch (mode) {
      case 'Normal':
        break;
      case 'Speed Demons':
        data.ball.xSpeed *= 2;
        data.ball.ySpeed *= 2;
        break;
      case 'Magician':
        data.paddle1.mana = 0;
        data.paddle2.mana = 0;
        data.spellWeaver = new SpellWeaverEntity(data.ball, data.paddle1);
        data.spawner = new GraviraSpawner();
        break;
    }

    return data;
  }

  deleteLobby(lobbyId: string) {
    this.lobbies = this.lobbies.filter((lobby) => lobby.id != lobbyId);
  }

  isPlayerOnLobby(playerId: string) {
    return !!this.lobbies.find((lobby) =>
      lobby.players.find((x) => x.id == playerId),
    );
  }

  isJoinedLobby(player1: string, player2: string) {
    return !!this.lobbies.find(
      (lobby) =>
        lobby.players.find((x) => x.id == player1) &&
        lobby.players.find((x) => x.id == player2),
    );
  }

  getLobby(playerId: string) {
    return this.lobbies.find((lobby) =>
      lobby.players.find((x) => x.id == playerId),
    );
  }

  Exist(lobbyId: string): boolean {
    return !!this.lobbies.find((lobby) => lobby.id == lobbyId);
  }
}
