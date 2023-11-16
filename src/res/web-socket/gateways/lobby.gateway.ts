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
import Lobby from '../types/lobby.interface';
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
	@SubscribeMessage('lobbyInvite')
	handleLobbyInvite(socket: Socket, data: BodyData) {
		this.io.to(data.data.receiver).emit('lobbyInvite', data.data.senderInfo);
	}

	@SubscribeMessage('lobbyAccept')
	async handleLobbyCreate(socket: Socket, data: BodyData) {
		try {
			let lobby = await this.lobbyService.createLobby({
				players: [data.data.id, data.sender.id],
			});

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
		} catch (error) {
			// console.log(error);
		}
	}


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
		lobby.isOwner = true;
		this.io.to(lobby.players[0].id).emit('lobbyChange', lobby);
		lobby.isOwner = false;
		this.io.to(lobby.players[1].id).emit('lobbyChange', lobby);
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

	gameStarted(lobby: Lobby) {
		lobby.lobbySate = 'ingame';
		lobby.isOwner = true;
		this.io.to(lobby.players[0].id).emit('lobbyChange', lobby);
		lobby.isOwner = false;
		this.io.to(lobby.players[1].id).emit('lobbyChange', lobby);
		const gameInterval = setInterval(async () => {
			const gameData = this.gameService.updateGame(lobby.gameData);
			this.io.to(lobby.id).emit('gameData', gameData);
			if (lobby.gameData.scoreUpdated) {
				this.io.to(lobby.id).emit('scoreChange', lobby.gameData.score);
				lobby.gameData.scoreUpdated = false;
				if (lobby.gameData.score[0] == 10 || lobby.gameData.score[1] == 10) {
					lobby.lobbySate = 'idle';
					lobby.isOwner = true;
					this.io.to(lobby.players[0].id).emit('lobbyChange', lobby);
					lobby.isOwner = false;
					this.io.to(lobby.players[1].id).emit('lobbyChange', lobby);
					this.io.to(lobby.id).emit('gameEnd', lobby);
					await this.statsService.saveGame(lobby);
					clearInterval(gameInterval);
				}
			}
		}, 16.6666666667);
	}

	matchCountdown(lobby: Lobby) {
		let number = 2;
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

	@SubscribeMessage('enterQueue')
	async handleEnterQueue(socket: Socket, data: BodyData) {
		const queueData: queueData = {
			startDate: Date.now(),
			id: data.sender.id,
			...data.data,
		};
		this.io.to(data.sender.id).emit('enterQueue', queueData);

		if (this.matchmakingService.Qplayers.length > 0) {
			for (let i = 0; i < this.matchmakingService.Qplayers.length; i++) {
				if (this.matchmakingService.Qplayers[i].id == data.sender.id) return;
				const isRanked =
					this.matchmakingService.Qplayers[i].ranked == data.data.ranked &&
					data.data.ranked == true;
				// this.queuedPlayers[i].ranked && data.data.ranked
				if (
					(isRanked &&
						Math.abs(
							this.matchmakingService.Qplayers[i].rating - data.data.rating,
						) < 500) ||
					this.matchmakingService.Qplayers[i].gamemode == data.data.gamemode // ??
				) {
					// console.log(this.queuedPlayers);

					try {
						let lobby = await this.lobbyService.createLobby(
							{
								players: [
									this.matchmakingService.Qplayers[i].id,
									data.sender.id,
								],
							},
							this.matchmakingService.Qplayers[i].gamemode,
							true,
							this.matchmakingService.Qplayers[i].ranked,
							'starting',
						);

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

						this.io.to(lobby.id).emit('matchFound');
						this.matchCountdown(lobby);

						this.matchmakingService.Qplayers.splice(i, 1);
					} catch (error) {
						// console.log(error);
					}
					//if match found no need to push
					return;
				}
			}
		}
		this.matchmakingService.addPlayer(queueData);
	}

	@SubscribeMessage('leaveQueue')
	handleLeaveQueue(socket: Socket, data: BodyData) {
		this.matchmakingService.removePlayer(data.sender.id);
		this.io.to(data.sender.id).emit('leaveQueue');
	}
}
