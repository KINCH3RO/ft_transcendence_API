import { UseFilters, UseGuards } from '@nestjs/common';
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
import queueData from '../types/queue-data.interface';
import { MatchmakingService } from '../services/matchmaking.service';
import { StatsService } from 'src/game/stats.service';

//handling present events

@UseFilters(new BaseWsExceptionFilter())
@UseGuards(TokenGuard)
@WebSocketGateway({ cors: true, transports: ['websocket'] })
export class MainGate implements OnGatewayConnection, OnGatewayDisconnect {
	constructor(
		private readonly webSocketService: WebSocketService,
		private lobbyService: LobbyService,
		private matchmakingService: MatchmakingService,
		private statsService: StatsService,
	) { }

	@WebSocketServer()
	io: Server;

	handleConnection(client: Socket, ...args: any[]) {
		// console.log(client);
		console.log('=> A socket has connected with ID: ', client.id);
		if (!client.handshake.query.userId) {
			client.disconnect();
			return false;
		}
		this.webSocketService.getUserFromToken(
			client.handshake.query.userId as string,
			(userData) => {
				client.join(userData.sub);
				// join all user channels (chat)
				this.webSocketService
					.getUserChannels(userData.sub)
					.then((channels) => client.join(channels));
				//emit event to other user that the user is connected
				this.webSocketService.userConnected(userData.sub, client.id, () => {
					client.broadcast.emit('connected', userData.sub);
				});
				//emit queue event
				const queueData: queueData = this.matchmakingService.getPlayerInQ(
					userData.sub,
				);
				if (queueData) client.emit('enterQueue', queueData);
				let lobby: Lobby = this.lobbyService.getLobby(userData.sub);
				//lobby stuff
				if (!lobby) return;
				client.join(lobby.id);
				lobby.isOwner = lobby.owner == userData.sub;
				client.emit('lobbyData', lobby);
			},
			(err) => {
				console.log(err);
				client.disconnect();
			},
		);
	}
	handleDisconnect(client: Socket) {
		console.log('=> A socket has disconnected with ID: ', client.id);
		if (!client.handshake.query.userId) return false;
		this.webSocketService.userDisconnected(
			client.handshake.query.userId as string,
			client.id,
			async (userID) => {
				client.broadcast.emit('disconnected', userID);
				let lobby: Lobby = this.lobbyService.getLobby(userID);
				//matchmaking suff
				this.matchmakingService.removePlayer(userID);
				//lobby stuff
				if (!lobby) return;
				let oppnentdID = lobby.players.find((x) => x.id != userID).id;
				if (lobby.lobbySate == 'ingame') {
					if (oppnentdID == lobby.players[0].id) lobby.gameData.score[0] = 5;
					else lobby.gameData.score[1] = 5;
					lobby.gameData.timer =
						(Date.now() - lobby.gameData.gameStartDate) / 1000;
					const [winner, loser] = await this.statsService.saveGame(lobby);
					this.io.to(winner.id).emit('gameEnd', { lobby, rewards: winner });
				}
				this.io.to(lobby.id).emit('leaveLobby');
				this.webSocketService.getSockets(oppnentdID).forEach((socketID) => {
					this.io.sockets.sockets.get(socketID).leave(lobby.id);
				});
				this.lobbyService.deleteLobby(lobby.id);
				//end lobby
				//
			},
		);
	}

	@SubscribeMessage('presence')
	handlePresence(socket: Socket, data: BodyData) {
		this.webSocketService.setPresenceState(data.sender.id, data.data);
		socket.broadcast.emit('presence', data);

		// console.log(this.webSocketService.onlineUsers[data.sender.id]);
	}
}
