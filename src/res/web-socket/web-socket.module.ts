import { Module } from '@nestjs/common';
import { WebSocketService } from './web-socket.service';
import { ChatGate } from './chat.gateway';
import { MainGate } from './main.gateway';
import { JwtModule } from '@nestjs/jwt';
import { TokenGuard } from './token.guard';

@Module({
	exports:[WebSocketService],
	imports: [JwtModule],
	providers: [ ChatGate, MainGate, WebSocketService],
})
export class WebSocketModule { }
