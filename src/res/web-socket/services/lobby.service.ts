import { Injectable } from '@nestjs/common';
import Lobby, { LobbyCreate } from '../types/lobby.interface';
import { randomUUID } from 'crypto';
import { ProfileService } from 'src/res/profile/profile.service';
import UserData from '../types/user-data.interface';

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
    let user1: UserData = await this.profileService.findDataByUserId(
      players[0],
    );
    let user2: UserData = await this.profileService.findDataByUserId(
      players[1],
    );
    let createdLobby: Lobby = {
      id: randomUUID(),
      players: [user1, user2],
      mode: mode,
      queueLobby: queueLobby,
      owner: players[0],
      ranked: ranked,
      lobbySate: lobbySate,
      isOwner: false,
      gameData: {
        paddle1: { x: 0, y: 40, isUP: false, isDown: false },
        paddle2: { x: 99, y: 40, isUP: false, isDown: false },
        ball: { x: 50, y: 50, xDirection: 1, yDirection: 1 },
        score: [0, 0],
        scoreUpdated: false,
        gameStartDate: NaN,
      },
    };
    this.lobbies.push(createdLobby);
    return createdLobby;
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
