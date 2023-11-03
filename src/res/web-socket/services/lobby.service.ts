import { Injectable } from '@nestjs/common';
import Lobby, { LobbyCreate } from '../types/lobby.interface';
import { randomUUID } from 'crypto';
import { ProfileService } from 'src/res/profile/profile.service';
import { user } from '@prisma/client';
import UserData from '../types/user-data.interface';

@Injectable()
export class LobbyService {


	constructor(private profileService: ProfileService) { }
	lobbies: Lobby[] = [];

	async createLobby(lobby: LobbyCreate) {

		if (this.isPlayerOnLobby(lobby.players[0]) || this.isPlayerOnLobby(lobby.players[1]))
			throw "already exist"
		let user1: UserData = await this.profileService.findDataByUserId(lobby.players[0]);
		let user2: UserData = await this.profileService.findDataByUserId(lobby.players[1]);

		let createdLobby: Lobby = {
			id: randomUUID(),
			players: [user1, user2],
			mode: "Normal",
			queueLobby: false,
			owner: lobby.players[0],
			ranked: false,
			lobbySate: "idle",
			isOwner: false,
			gameData: {}
		}
		this.lobbies.push(createdLobby);
		return createdLobby;
	}

	deleteLobby(lobbyId: string) {
		this.lobbies = this.lobbies.filter(lobby => lobby.id != lobbyId);
	}

	isPlayerOnLobby(playerId: string) {
		return !!this.lobbies.find(lobby => lobby.players.filter(x => x.id == playerId));

	}

	getLobby(playerId: string) {
		return this.lobbies.find(lobby => lobby.players.filter(x => x.id == playerId)) ?? null;
	}



}
