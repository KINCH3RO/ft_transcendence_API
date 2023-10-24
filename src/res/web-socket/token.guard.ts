import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { Observable } from 'rxjs';
import { JwtService } from '@nestjs/jwt';
@Injectable()
export class TokenGuard implements CanActivate {

	constructor(private jwtService: JwtService) { };
	canActivate(
		context: ExecutionContext,
	): boolean | Promise<boolean> | Observable<boolean> {
		const data = context.switchToWs().getData();
		if (data.token == null)
			throw new WsException("Not Authorized")
		try {
			this.jwtService.verify(data.token, {
				secret: process.env.JWT_SECRET,
			})
		} catch (error) {
			throw new WsException("Not Authorized")
		}
		return true;
	}
}
