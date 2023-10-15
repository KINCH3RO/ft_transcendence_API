import { Injectable } from '@nestjs/common';
import { compare, genSalt,hash } from 'bcrypt';

@Injectable()
export class HashingService {
	async hash(data: string | Buffer): Promise<string> {
		const salt = await genSalt()
		return hash(data,salt)
	}
	async compare(data: string | Buffer, enctypted: string): Promise<boolean> {
		return compare(data,enctypted)
	}
}
