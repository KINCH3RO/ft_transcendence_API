import { UseFilters, UseGuards, UseInterceptors, UsePipes } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
	BaseWsExceptionFilter,
	OnGatewayConnection,
	OnGatewayDisconnect,
	SubscribeMessage,
	WebSocketGateway,
	WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { TokenGuard } from '../token.guard';
import { BodyData } from '../types/body-data.interface';
import { WebSocketService } from '../services/web-socket.service';
import { LobbyService } from '../services/lobby.service';
import Lobby from '../types/lobby.interface';

//handling present events

@UseFilters(new BaseWsExceptionFilter())
@UseGuards(TokenGuard)
@WebSocketGateway({ cors: true, transports: ['websocket'] })
export class MainGate implements OnGatewayConnection, OnGatewayDisconnect {
	constructor(
		private readonly webSocketService: WebSocketService,
		private lobbyService: LobbyService,
	) { }

	@WebSocketServer()
	io: Server;

	handleConnection(client: any, ...args: any[]) {
		// console.log(client);
		console.log('=> A socket has connected with ID: ', client.id);
	}

	handleDisconnect(client: any) {
		console.log('=> A socket has disconnected with ID: ', client.id);
		if (!client.handshake.query.userId) return false;
		this.webSocketService.userDisconnected(
			client.handshake.query.userId,
			client.id,
			(userID) => {
				client.broadcast.emit('disconnected', userID);

				let lobby: Lobby = this.lobbyService.getLobby(userID);
				//lobby stuff
				if (!lobby) return;
				let oppnentdID = lobby.players.find((x) => x.id != userID).id;
				this.io.to(lobby.id).emit(
					'leaveLobby',
					lobby.players.find((x) => x.id == userID),
				);
				this.webSocketService.getSockets(oppnentdID).forEach((socketID) => {
					this.io.sockets.sockets.get(socketID).leave(lobby.id);
				});
				this.lobbyService.deleteLobby(lobby.id);
				//end lobby
			},
		);
	}


	@SubscribeMessage('testTest')
	ha(socket: Socket, data: BodyData) {
		// join rooms with sender id

	}
	@SubscribeMessage('connected')
	handleConnect(socket: Socket, data: BodyData) {
		// join rooms with sender id
		socket.join(data.sender.id);
		// join all user channels
		socket.join(data.data);
		this.webSocketService.userConnected(data.sender.id, socket.id, () => {
			socket.broadcast.emit('connected', data.sender.id);
		});
	}

	@SubscribeMessage('presence')
	handlePresence(socket: Socket, data: BodyData) {
		this.webSocketService.setPresenceState(data.sender.id, data.data);
		// console.log(this.webSocketService.onlineUsers[data.sender.id]);
	}
}
