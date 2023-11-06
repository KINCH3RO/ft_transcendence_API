import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  BaseWsExceptionFilter,
} from '@nestjs/websockets';
import { WebSocketService } from './web-socket.service';
import { Socket, Server } from 'socket.io';
import { UseFilters, UseGuards, UsePipes } from '@nestjs/common';
import { TokenGuard } from './token.guard';
import { TokenPipe } from './token.pipe';
import { JwtService } from '@nestjs/jwt';
import { BodyData } from './body-data.interface';

@UseFilters(new BaseWsExceptionFilter())
@UseGuards(TokenGuard)
@UsePipes(new TokenPipe(new JwtService()))
@WebSocketGateway({ cors: true, transports: ['websocket'] })
export class ChatGate {
  @WebSocketServer()
  server: Server;
  //handling chat events
  constructor(private readonly webSocketService: WebSocketService) {}

  // @SubscribeMessage('client_ID')
  // handleRoom(socket: Socket, clientId: string) {
  //   socket.join(clientId);
  // }

  // @SubscribeMessage('msgs')
  // handleMsg(socket: Socket, data: { msg: string; room: string }) {
  //   this.server.to(data.room).emit('chatToClient', data.msg);
  // }

  // @SubscribeMessage('joinRoom')
  // handleJoinRoom(socket: Socket, room: string) {
  //   socket.join(room);
  //   socket.emit('joind', room);
  // }

  // @SubscribeMessage('leaveRoom')
  // handleLeaveRoom(socket: Socket, room: string) {
  //   socket.leave(room);
  //   socket.emit('left', room);
  // }

  @SubscribeMessage('channel joined')
  handleJoinRoom(socket: Socket, data: BodyData) {
    this.server.to(data.data.channelID).emit('new member joind', data.data);
  }

  @SubscribeMessage('channel left')
  handleLeftRoom(socket: Socket, data: BodyData) {
    console.log('left' , data)
    this.server.to(data.data.channelID).emit('a member left', data.sender.id);
  }

}
