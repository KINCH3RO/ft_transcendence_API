import { Module } from '@nestjs/common';
import { WebSocketService } from './web-socket.service';
import { ChatGate } from './chat.gateway';
import { MainGate } from './main.gateway';

@Module({
	providers: [ChatGate, MainGate, WebSocketService],
})
export class WebSocketModule { }
