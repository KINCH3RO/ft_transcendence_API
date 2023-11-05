import { UseFilters, UseGuards, UsePipes } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Socket, Server } from 'socket.io';

import {
	BaseWsExceptionFilter,
	SubscribeMessage,
	WebSocketGateway,
	WebSocketServer
} from '@nestjs/websockets';
import { TokenGuard } from '../token.guard';
import { TokenPipe } from '../token.pipe';
import { WebSocketService } from '../services/web-socket.service';
import { BodyData } from '../types/body-data.interface';
import { LobbyService } from '../services/lobby.service';
import { randomUUID } from 'crypto';
import Lobby from '../types/lobby.interface';
import queueData from '../types/queue-data.interface';
//handling present events

@UseFilters(new BaseWsExceptionFilter())
@UseGuards(TokenGuard)
@UsePipes(new TokenPipe(new JwtService()))
@WebSocketGateway({ cors: true, transports: ['websocket'] })

export class LobbyGate {
	constructor(private readonly webSocketService: WebSocketService, private lobbyService: LobbyService) {

	}

	@WebSocketServer()
	io: Server;
	@SubscribeMessage("lobbyInvite")
	handleLobbyInvite(socket: Socket, data: BodyData) {
		this.io.to(data.data.receiver).emit("lobbyInvite", data.data.senderInfo)
	}

	@SubscribeMessage("getLobbyData")
	handleGetLobbyData(socket: Socket, data: BodyData) {
		let lobby = this.lobbyService.getLobby(data.sender.id);
		if (!lobby)
			return;
		lobby.isOwner = lobby.owner == data.sender.id;
		socket.emit("lobbyData", lobby)
	}

	@SubscribeMessage("lobbyAccept")
	async handleLobbyCreate(socket: Socket, data: BodyData) {


		try {
			let lobby = await this.lobbyService.createLobby({
				players: [data.data.id, data.sender.id],
			})

			this.webSocketService.getSockets(lobby.players[0].id).forEach(socketID => {
				this.io.sockets.sockets.get(socketID).join(lobby.id);
				lobby.isOwner = lobby.owner == lobby.players[0].id;
				this.io.to(lobby.players[0].id).emit("lobbyData", lobby)
			})

			this.webSocketService.getSockets(lobby.players[1].id).forEach(socketID => {
				this.io.sockets.sockets.get(socketID).join(lobby.id);
				lobby.isOwner = lobby.owner == lobby.players[1].id;
				this.io.to(lobby.players[1].id).emit("lobbyData", lobby)
			})
		} catch (error) {
			console.log(error);
		}

	}

	@SubscribeMessage("leaveLobby")
	handleLeaveLobby(socket: Socket, data: BodyData) {

		let lobby: Lobby = data.data;
		if (!lobby)
			return;
		let oppnentdID = lobby.players.find(x => x.id != data.sender.id).id
		this.io.to(oppnentdID).emit("leaveLobby", lobby.players.find(x => x.id == data.sender.id))
		this.io.to(data.sender.id).emit("leaveLobby")
		this.webSocketService.getSockets(lobby.players[0].id).forEach(socketID => {
			this.io.sockets.sockets.get(socketID).leave(lobby.id);
		})
		this.webSocketService.getSockets(lobby.players[1].id).forEach(socketID => {
			this.io.sockets.sockets.get(socketID).leave(lobby.id);

		})
		this.lobbyService.deleteLobby(lobby.id);

	}

	@SubscribeMessage("lobbyChange")
	handleLobbyChange(socket: Socket, data: BodyData) {

		let lobby: Lobby = data.data;
		if (!lobby)
			return;
		lobby.isOwner = true;
		this.io.to(lobby.players[0].id).emit("lobbyChange", lobby)
		lobby.isOwner = false;
		this.io.to(lobby.players[1].id).emit("lobbyChange", lobby)

	}


	@SubscribeMessage("createPrivateGame")
	handeCreateGame(socket: Socket, data: BodyData) {
		let lobby = this.lobbyService.getLobby(data.sender.id)
		if (!lobby)
			return;
		lobby.lobbySate = "starting"
		this.io.to(lobby.id).emit("lobbyChange", lobby)
		console.log("counting down");

		this.matchCountdown(lobby);

	}

	//matchmaking system
	queuedPlayers: queueData[] = []

	matchCountdown(lobby: Lobby) {
		let number = 10;

		const interval = setInterval(() => {
			if (!this.lobbyService.Exist(lobby.id)) {
				clearInterval(interval)
				return;
			}

			if (number > 0)
				this.io.to(lobby.id).emit("matchStarting", --number);
			else {
				lobby.lobbySate = 'ingame';
				lobby.isOwner = true;
				this.io.to(lobby.players[0].id).emit("lobbyChange", lobby)
				lobby.isOwner = false;
				this.io.to(lobby.players[1].id).emit("lobbyChange", lobby)
				clearInterval(interval);
			}
		}, 1000)
	}
	@SubscribeMessage("enterQueue")
	async handleEnterQueue(socket: Socket, data: BodyData) {


		if (this.queuedPlayers.length > 0) {
			for (let i = 0; i < this.queuedPlayers.length; i++) {

				if (Math.abs(this.queuedPlayers[i].rating - data.data.rating) < 500 && this.queuedPlayers[i].ranked == data.data.ranked && this.queuedPlayers[i].gamemode == data.data.gamemode) {
					console.log(this.queuedPlayers);

					try {
						let lobby = await this.lobbyService.createLobby({
							players: [this.queuedPlayers[i].id, data.sender.id],
						}, this.queuedPlayers[i].gamemode, true, this.queuedPlayers[i].ranked, "starting")

						this.webSocketService.getSockets(lobby.players[0].id).forEach(socketID => {
							this.io.sockets.sockets.get(socketID).join(lobby.id);
							lobby.isOwner = lobby.owner == lobby.players[0].id;
							this.io.to(lobby.players[0].id).emit("lobbyData", lobby)
						})

						this.webSocketService.getSockets(lobby.players[1].id).forEach(socketID => {
							this.io.sockets.sockets.get(socketID).join(lobby.id);
							lobby.isOwner = lobby.owner == lobby.players[1].id;
							this.io.to(lobby.players[1].id).emit("lobbyData", lobby)
						})

						this.io.to(lobby.id).emit("matchFound")
						this.matchCountdown(lobby);

						this.queuedPlayers.splice(i, 1);

					} catch (error) {
						console.log(error);
					}
					//if match found no need to push
					return;
				}


			}
		}

		this.queuedPlayers.push(
			{
				id: data.sender.id,
				...data.data
			}
		)


		console.log(this.queuedPlayers);



	}

	@SubscribeMessage("leaveQueue")
	handleLeaveQueue(socket: Socket, data: BodyData) {

		this.queuedPlayers = this.queuedPlayers.filter(x => x.id != data.sender.id)
		console.log(this.queuedPlayers);

	}



}
