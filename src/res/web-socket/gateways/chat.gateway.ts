import {
	SubscribeMessage,
	WebSocketGateway,
	WebSocketServer,
	OnGatewayConnection,
	BaseWsExceptionFilter,
} from '@nestjs/websockets';
import { WebSocketService } from '../services/web-socket.service';
import { UseFilters, UseGuards, UsePipes } from '@nestjs/common';
import { Socket, Server } from 'socket.io';
import { TokenGuard } from '../token.guard';
import { TokenPipe } from '../token.pipe';
import { JwtService } from '@nestjs/jwt';
import { BodyData } from '../types/body-data.interface';


@UseFilters(new BaseWsExceptionFilter())
@UseGuards(TokenGuard)
@UsePipes(new TokenPipe(new JwtService()))
@WebSocketGateway({ cors: true, transports: ['websocket'] })
export class ChatGate {
  @WebSocketServer()
  server: Server;
  //handling chat events
  constructor(private readonly webSocketService: WebSocketService) {}

  @SubscribeMessage('channelCreated')
  handleCreatedRoom(socket: Socket, data: BodyData) {
    console.log('>>>>>>>>>> her joind a channel with id:', data.data)
    socket.join(data.data)
  }

  @SubscribeMessage('channel joined')
  handleJoinRoom(socket: Socket, data: BodyData) {
    console.log('>>>>>>>>>> yes joind:', data.data.channelID, data.data)
    this.server.to(data.data.channelID).emit('new member joind', data.data);
  }

  @SubscribeMessage('channel left')
  handleLeftRoom(socket: Socket, data: BodyData) {
    this.server.to(data.data.channelID).emit('a member left', data.sender.id);
  }

  @SubscribeMessage('updateChannelInfo')
  handleRoomUpdated(socket: Socket, data: BodyData) {
    this.server.to(data.data.id).emit('channelUpdated', data.data);
  }

  @SubscribeMessage('deleteChannel')
  handleRoomRemoved(socket: Socket, data: BodyData) {
    this.server.to(data.data.id).emit('roomRemoved', data.data);
  }

}
