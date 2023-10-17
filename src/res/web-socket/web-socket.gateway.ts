import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
} from '@nestjs/websockets';
import { WebSocketService } from './web-socket.service';
import { Socket, Server } from 'socket.io';

@WebSocketGateway({ cors: true })
export class WebSocketGate implements OnGatewayConnection {
  @WebSocketServer()
  server: Server;

  constructor(private readonly webSocketService: WebSocketService) {}

  handleConnection(client: any, ...args: any[]) {
    console.log('=> A clinet has connected with ID: ', client.id);
  }

  @SubscribeMessage('client_ID')
  handleRoom(socket: Socket, clientId: string) {
    socket.join(clientId);
  }

  @SubscribeMessage('msgs')
  handleMsg(socket: Socket, data: { msg: string; room: string }) {
    this.server.to(data.room).emit('chatToClient', data.msg);
  }

  @SubscribeMessage('joinRoom')
  handleJoinRoom(socket: Socket, room: string) {
    socket.join(room);
    socket.emit('joind', room);
  }

  @SubscribeMessage('leaveRoom')
  handleLeaveRoom(socket: Socket, room: string) {
    socket.leave(room);
    socket.emit('left', room);
  }
}
