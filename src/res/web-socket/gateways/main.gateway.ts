import { UseFilters, UseGuards, UsePipes } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
	BaseWsExceptionFilter,
	OnGatewayConnection,
	OnGatewayDisconnect,
	SubscribeMessage,
	WebSocketGateway,
	WebSocketServer
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { TokenGuard } from '../token.guard';
import { TokenPipe } from '../token.pipe';
import { BodyData } from '../types/body-data.interface';
import { WebSocketService } from '../services/web-socket.service';
import { LobbyService } from '../services/lobby.service';
import Lobby from '../types/lobby.interface';
import queueData from '../types/queue-data.interface';
//handling present events

@UseFilters(new BaseWsExceptionFilter())
@UseGuards(TokenGuard)
@UsePipes(new TokenPipe(new JwtService()))
@WebSocketGateway({ cors: true, transports: ['websocket'] })
export class MainGate implements OnGatewayConnection, OnGatewayDisconnect {
	constructor(private readonly webSocketService: WebSocketService, private lobbyService: LobbyService) { }

	@WebSocketServer()
	io: Server;

	handleConnection(client: any, ...args: any[]) {
		console.log('=> A socket has connected with ID: ', client.id);
	}

	handleDisconnect(client: any) {
		console.log('=> A socket has disconnected with ID: ', client.id);
		if (!client.handshake.query.userId)
			return false;
		this.webSocketService.userDisconnected(client.handshake.query.userId, client.id, (userID) => {

			client.broadcast.emit("disconnected", userID)

			let lobby: Lobby = this.lobbyService.getLobby(userID);
			//lobby stuff
			if (!lobby)
				return;
			let oppnentdID = lobby.players.find(x => x.id != userID).id
			this.io.to(lobby.id).emit("leaveLobby", lobby.players.find(x => x.id == userID))
			this.webSocketService.getSockets(oppnentdID).forEach(socketID => {
				this.io.sockets.sockets.get(socketID).leave(lobby.id);
			})

			this.lobbyService.deleteLobby(lobby.id);
			//end lobby
		})
	}

	@SubscribeMessage('connected')
	handleConnect(socket: Socket, data: BodyData) {

		socket.join(data.sender.id);

		for (let i = 0; i < data.data.length; i++)
			socket.join(data.data);



		this.webSocketService.userConnected(data.sender.id, socket.id, () => {
			socket.broadcast.emit("connected", data.sender.id);
		})

	}

	@SubscribeMessage('presence')
	handlePresence(socket: Socket, data: BodyData) {

		this.webSocketService.setPresenceState(data.sender.id, data.data);
		// console.log(this.webSocketService.onlineUsers[data.sender.id]);
	}

	//matchmaking system
	queuedPlayers: queueData[] = []



	@SubscribeMessage("enterQueue")
	async handleEnterQueue(socket: Socket, data: BodyData) {


		if (this.queuedPlayers.length > 0) {
			console.log("yes");
			for (let i = 0; i < this.queuedPlayers.length; i++) {

				if (Math.abs(this.queuedPlayers[i].rating - data.data.rating) < 500 && this.queuedPlayers[i].ranked == data.data.ranked && this.queuedPlayers[i].gamemode == data.data.gamemode) {
					console.log(this.queuedPlayers);

					try {
						let lobby = await this.lobbyService.createLobby({
							players: [this.queuedPlayers[i].id, data.sender.id],
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

						this.io.to(lobby.id).emit("Match found")
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
