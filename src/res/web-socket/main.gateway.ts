import {
	SubscribeMessage,
	WebSocketGateway,
	WebSocketServer,
	OnGatewayConnection,
	OnGatewayDisconnect,
} from '@nestjs/websockets';
import { WebSocketService } from './web-socket.service';
import { Socket, Server } from 'socket.io';
//handling present events
@WebSocketGateway({ cors: true })
export class MainGate implements OnGatewayConnection, OnGatewayDisconnect {
	constructor(private readonly webSocketService: WebSocketService) { }
	handleDisconnect(client: any) {
		console.log('=> A client has disconnected with ID: ', client.id);
	}
	@WebSocketServer()
	server: Server;
	handleConnection(client: any, ...args: any[]) {
		console.log('=> A client has connected with ID: ', client.id);
	}




	@SubscribeMessage('testGate')
	handleMessage(socket: Socket, clientId: string) {
		console.log("yes")
	}

}
