import { Injectable } from '@nestjs/common';
import queueData from '../types/queue-data.interface';

@Injectable()
export class MatchmakingService {
  private queuedPlayers: queueData[] = [];

  getPlayerInQ(playerID: string) {
    return this.queuedPlayers.find((x) => x.id == playerID);
  }

  get Qplayers() {
    return this.queuedPlayers;
  }

  removePlayer(playerID: string) {
    this.queuedPlayers = this.queuedPlayers.filter((x) => x.id != playerID);
  }

  addPlayer(queueData: queueData) {
    if (!this.queuedPlayers.find((data) => data.id == queueData.id))
      this.queuedPlayers.push(queueData);
    // console.log(this.queuedPlayers);
  }
}
