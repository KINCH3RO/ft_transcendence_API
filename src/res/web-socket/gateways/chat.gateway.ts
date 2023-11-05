import {
	SubscribeMessage,
	WebSocketGateway,
	WebSocketServer,
	OnGatewayConnection,
} from '@nestjs/websockets';
import { WebSocketService } from '../services/web-socket.service';
import { Socket, Server } from 'socket.io';

@WebSocketGateway({ cors: true, transports: ['websocket'] })

export class ChatGate {
	@WebSocketServer()
	server: Server;
	//handling chat events
	constructor(private readonly webSocketService: WebSocketService) { }


	//   @SubscribeMessage('client_ID')
	//   handleRoom(socket: Socket, clientId: string) {
	//     socket.join(clientId);
	//   }

	//   @SubscribeMessage('msgs')
	//   handleMsg(socket: Socket, data: { msg: string; room: string }) {
	//     this.server.to(data.room).emit('chatToClient', data.msg);
	//   }

	//   @SubscribeMessage('joinRoom')
	//   handleJoinRoom(socket: Socket, room: string) {
	//     socket.join(room);
	//     socket.emit('joind', room);
	//   }

	//   @SubscribeMessage('leaveRoom')
	//   handleLeaveRoom(socket: Socket, room: string) {
	//     socket.leave(room);
	//     socket.emit('left', room);
	//   }
}
