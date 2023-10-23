import {

	SubscribeMessage,
	WebSocketGateway,
	WebSocketServer,
	OnGatewayConnection,
	OnGatewayDisconnect,
	MessageBody,
	ConnectedSocket,
	WsException,
} from '@nestjs/websockets';
import { WebSocketService } from './web-socket.service';
import { Socket, Server } from 'socket.io';
import { ActiveUser } from 'src/iam/authentication/decorators/active-user.decorator';
import { UseFilters, UseGuards, UsePipes } from '@nestjs/common';
import { TokenGuard } from './token.guard';
import { TokenPipe } from './token.pipe';
import { JwtService } from '@nestjs/jwt';
import { BaseWsExceptionFilter } from '@nestjs/websockets';
import { BodyData } from './body-data.interface';
//handling present events

@UseFilters(new BaseWsExceptionFilter())
@UseGuards(TokenGuard)
@UsePipes(new TokenPipe(new JwtService()))
@WebSocketGateway({ cors: true })
export class MainGate implements OnGatewayConnection, OnGatewayDisconnect {
	constructor(private readonly webSocketService: WebSocketService) { }

	@WebSocketServer()
	io: Server;

	handleConnection(client: any, ...args: any[]) {
		console.log('=> A socket has connected with ID: ', client.id);
	}

	handleDisconnect(client: any) {
		console.log('=> A socket has disconnected with ID: ', client.id);
		this.webSocketService.userDisconnected(client.handshake.query.userId, client.id, () => {
			this.io.emit("disconnected", client.handshake.query.userId)
		})

	}

	@SubscribeMessage('connected')
	handleConnect(socket: Socket, data: BodyData) {
		socket.join(data.sender.id);
		this.webSocketService.userConnected(data.sender.id, socket.id, () => {
			this.io.emit("connected", data.sender.id);
		})

	}


}
