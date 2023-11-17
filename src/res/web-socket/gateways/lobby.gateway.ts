import { UseFilters, UseGuards, UsePipes } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Socket, Server } from 'socket.io';

import {
	BaseWsExceptionFilter,
	SubscribeMessage,
	WebSocketGateway,
	WebSocketServer,
} from '@nestjs/websockets';
import { TokenGuard } from '../token.guard';
import { WebSocketService } from '../services/web-socket.service';
import { BodyData } from '../types/body-data.interface';
import { LobbyService } from '../services/lobby.service';
import Lobby, { LobbyCreate } from '../types/lobby.interface';
import queueData from '../types/queue-data.interface';
import { GameService } from 'src/game/game.service';
import { MatchmakingService } from '../services/matchmaking.service';
import { StatsService } from 'src/game/stats.service';
//handling present events

@UseFilters(new BaseWsExceptionFilter())
@UseGuards(TokenGuard)
@WebSocketGateway({ cors: true, transports: ['websocket'] })
export class LobbyGate {
	constructor(
		private readonly webSocketService: WebSocketService,
		private lobbyService: LobbyService,
		private gameService: GameService,
		private matchmakingService: MatchmakingService,
		private statsService: StatsService,
	) { }

	@WebSocketServer()
	io: Server;



	clearLobby(lobby: Lobby) {
		this.webSocketService
			.getSockets(lobby.players[0].id)
			.forEach((socketID) => {
				this.io.sockets.sockets.get(socketID).leave(lobby.id);
			});
		this.webSocketService
			.getSockets(lobby.players[1].id)
			.forEach((socketID) => {
				this.io.sockets.sockets.get(socketID).leave(lobby.id);
			});
		this.lobbyService.deleteLobby(lobby.id);
	}


	emitLobbyChange(lobby: Lobby) {
		lobby.isOwner = true;
		this.io.to(lobby.players[0].id).emit('lobbyChange', lobby);
		lobby.isOwner = false;
		this.io.to(lobby.players[1].id).emit('lobbyChange', lobby);
	}

	gameStarted(lobby: Lobby) {
		lobby.lobbySate = 'ingame';
		this.io.to(lobby.id).emit('lobbyChange', lobby)
		const gameInterval = setInterval(async () => {
			if (!this.lobbyService.Exist(lobby.id)) {
				clearInterval(gameInterval);
				return;
			}
			const gameData = this.gameService.updateGame(lobby.gameData);
			this.io.to(lobby.id).emit('gameData', gameData);
			if (lobby.gameData.scoreUpdated) {
				this.io.to(lobby.id).emit('scoreChange', lobby.gameData.score);
				lobby.gameData.scoreUpdated = false;
				if (lobby.gameData.score[0] != 5 && lobby.gameData.score[1] != 5)
					return
				lobby.lobbySate = 'idle';
				this.io.to(lobby.id).emit('gameEnd', lobby);
				await this.statsService.saveGame(lobby);
				if (lobby.queueLobby) {
					this.io.to(lobby.id).emit('leaveLobby');
					this.clearLobby(lobby)
				}
				else {
					this.resetGameData(lobby)
					this.emitLobbyChange(lobby)
				}
				clearInterval(gameInterval);

			}
		}, 16.6666666667);
	}

	async createLobby(lobbyData: LobbyCreate) {
		let lobby = await this.lobbyService.createLobby(lobbyData);

		this.webSocketService
			.getSockets(lobby.players[0].id)
			.forEach((socketID) => {
				this.io.sockets.sockets.get(socketID).join(lobby.id);
				lobby.isOwner = lobby.owner == lobby.players[0].id;
				this.io.to(lobby.players[0].id).emit('lobbyData', lobby);
			});

		this.webSocketService
			.getSockets(lobby.players[1].id)
			.forEach((socketID) => {
				this.io.sockets.sockets.get(socketID).join(lobby.id);
				lobby.isOwner = lobby.owner == lobby.players[1].id;
				this.io.to(lobby.players[1].id).emit('lobbyData', lobby);
			});
		return lobby;

	}

	resetGameData(lobby: Lobby) {
		lobby.gameData = {
			paddle1: { x: 0, y: 40, isUP: false, isDown: false },
			paddle2: { x: 99, y: 40, isUP: false, isDown: false },
			ball: { x: 50, y: 50, xDirection: 1, yDirection: 1 },
			score: [0, 0],
			scoreUpdated: false,
		}
	}



	findGame(data: BodyData) {


		if (this.matchmakingService.Qplayers.length <= 0)
			return null
		for (let i = 0; i < this.matchmakingService.Qplayers.length; i++) {
			console.log(this.matchmakingService.Qplayers[i].gameMode);
			console.log(data.data.gameMode);
			if (this.matchmakingService.Qplayers[i].id == data.sender.id) return null;

			if (this.matchmakingService.Qplayers[i].gameMode != data.data.gameMode) continue;
			if (this.matchmakingService.Qplayers[i].ranked != data.data.ranked) continue;
			const ranked = this.matchmakingService.Qplayers[i].ranked;
			const gameMode = this.matchmakingService.Qplayers[i].gameMode;
			if (ranked &&
				Math.abs(
					this.matchmakingService.Qplayers[i].rating - data.data.rating,
				) > 500)
				continue;

			return { gameMode, ranked, player: this.matchmakingService.Qplayers.splice(i, 1)[0] }
		}
		return null;

	}


	matchCountdown(lobby: Lobby) {
		let number = 5;
		const interval = setInterval(() => {
			if (!this.lobbyService.Exist(lobby.id)) {
				clearInterval(interval);
				return;
			}
			if (number > 0) this.io.to(lobby.id).emit('matchStarting', --number);
			else {

				this.gameStarted(lobby)
				clearInterval(interval);
			}
		}, 1000);
	}



	@SubscribeMessage('lobbyInvite')
	handleLobbyInvite(socket: Socket, data: BodyData) {
		this.io.to(data.data.receiver).emit('lobbyInvite', data.data.senderInfo);
	}



	@SubscribeMessage('lobbyAccept')
	async handleLobbyCreate(socket: Socket, data: BodyData) {
		this.createLobby({
			players: [data.data.id, data.sender.id],
		}).then().catch()
	}

	@SubscribeMessage('leaveLobby')
	handleLeaveLobby(socket: Socket, data: BodyData) {
		let lobby: Lobby = data.data;
		if (!lobby) return;
		let oppnentdID = lobby.players.find((x) => x.id != data.sender.id).id;
		this.io.to(oppnentdID).emit(
			'leaveLobby',
			lobby.players.find((x) => x.id == data.sender.id),
		);
		this.io.to(data.sender.id).emit('leaveLobby');
		this.clearLobby(lobby)

	}

	@SubscribeMessage('lobbyChange')
	handleLobbyChange(socket: Socket, data: BodyData) {

		let lobby: Lobby = data.data;
		if (!lobby) return;
		this.emitLobbyChange(lobby)
	}

	@SubscribeMessage('paddleDown')
	handlePaddleDown(socket: Socket, data: BodyData) {
		let lobby: Lobby = this.lobbyService.getLobby(data.sender.id);
		if (lobby.players[0].id == data.sender.id)
			lobby.gameData.paddle1.isDown = data.data.isDown;
		else lobby.gameData.paddle2.isDown = data.data.isDown;
	}

	@SubscribeMessage('paddleUp')
	handlePaddleUp(socket: Socket, data: BodyData) {
		let lobby: Lobby = this.lobbyService.getLobby(data.sender.id);
		if (lobby.players[0].id == data.sender.id)
			lobby.gameData.paddle1.isUP = data.data.isUP;
		else lobby.gameData.paddle2.isUP = data.data.isUP;
	}

	@SubscribeMessage('createPrivateGame')
	handeCreateGame(socket: Socket, data: BodyData) {
		let lobby = this.lobbyService.getLobby(data.sender.id);
		if (!lobby) return;
		lobby.lobbySate = 'starting';
		this.io.to(lobby.id).emit('lobbyChange', lobby);
		// console.log("counting down");
		this.matchCountdown(lobby);
	}

	//matchmaking system




	@SubscribeMessage('enterQueue')
	async handleEnterQueue(socket: Socket, data: BodyData) {

		const queueData: queueData = {
			startDate: Date.now(),
			id: data.sender.id,
			...data.data,
		};
		this.io.to(data.sender.id).emit('enterQueue', queueData);
		const gameData = this.findGame(data)
		if (!gameData) {

			this.matchmakingService.addPlayer(queueData);
			console.log(this.matchmakingService.Qplayers);

			return;
		}
		let lobby = await this.createLobby(

			{
				players: [
					gameData.player.id,
					data.sender.id,
				],
				mode: gameData.gameMode,
				queueLobby: true,
				ranked: gameData.player.ranked,
				lobbySate: 'starting',
			},

		);
		this.io.to(lobby.id).emit('matchFound');
		this.matchCountdown(lobby);


	}

	@SubscribeMessage('leaveQueue')
	handleLeaveQueue(socket: Socket, data: BodyData) {
		this.matchmakingService.removePlayer(data.sender.id);
		this.io.to(data.sender.id).emit('leaveQueue');
	}



}
