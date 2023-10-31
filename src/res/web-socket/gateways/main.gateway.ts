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
//handling present events

@UseFilters(new BaseWsExceptionFilter())
@UseGuards(TokenGuard)
@UsePipes(new TokenPipe(new JwtService()))
@WebSocketGateway({ cors: true, transports: ['websocket'] })
export class MainGate implements OnGatewayConnection, OnGatewayDisconnect {
	constructor(private readonly webSocketService: WebSocketService) { }

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


}
