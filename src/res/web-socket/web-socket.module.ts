import { Module } from '@nestjs/common';
import { WebSocketService } from './web-socket.service';
import { WebSocketGate } from './web-socket.gateway';

@Module({
  providers: [WebSocketGate, WebSocketService],
})
export class WebSocketModule {}
