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
import { JwtService } from '@nestjs/jwt';
import { BodyData } from '../types/body-data.interface';


@UseFilters(new BaseWsExceptionFilter())
@UseGuards(TokenGuard)
@WebSocketGateway({ cors: true, transports: ['websocket'] })
export class ChatGate {
  @WebSocketServer()
  server: Server;
  //handling chat events
  constructor(private readonly webSocketService: WebSocketService) {}

  @SubscribeMessage('channelCreated')
  handleCreatedRoom(socket: Socket, data: BodyData) {
    console.log('create channel', data.data)
    socket.join(data.data)
  }

  @SubscribeMessage('channelJoined')
  handleJoinRoom(socket: Socket, data: BodyData) {
    socket.join(data.data.channelID)
    this.server.to(data.data.channelID).emit('newMemberJoind', data.data);
  }

  @SubscribeMessage('channelLeft')
  handleLeftRoom(socket: Socket, data: BodyData) {
    socket.leave(data.data.channelID)
    this.server.to(data.data.channelID).emit('aMemberLeft', data);
  }

  @SubscribeMessage('updateChannelInfo')
  handleRoomUpdated(socket: Socket, data: BodyData) {
    this.server.to(data.data.id).emit('channelUpdated', data.data);
  }

  @SubscribeMessage('deleteChannel')
  handleRoomRemoved(socket: Socket, data: BodyData) {
    this.server.to(data.data.id).emit('roomRemoved', data.data);
  }

  @SubscribeMessage('getUnbanned')
  handleUnbannedUserFromRoom(socket: Socket, data: BodyData) {
    this.server.to(data.data.channelID).emit('aMemberUnbanned', data.data);
    this.server.to(data.data.userID).emit('youGetUnbanned', data.data);
  }

  @SubscribeMessage('getBanned')
  handleBannedUserFromRoom(socket: Socket, data: BodyData) {
    this.server.to(data.data.channelID).emit('aMemberBanned', data.data);
    this.server.to(data.data.userID).emit('youGetBanned', data.data);
  }

  @SubscribeMessage('getKicked')
  handleKickedUserFromRoom(socket: Socket, data: BodyData) {
    this.server.to(data.data.channelID).emit('aMemberKicked', data.data);
    this.server.to(data.data.userID).emit('youGetKicked', data.data);
  }

  @SubscribeMessage('getMuted')
  handleMutedUserFromRoom(socket: Socket, data: BodyData) {
    this.server.to(data.data.channelID).emit('aMemberMuted', data.data);
    // this.server.to(data.data.userID).emit('youGetMuted', data.data);
  }

}
