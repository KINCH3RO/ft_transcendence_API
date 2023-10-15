import { Injectable,UnauthorizedException  } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { HashingService } from '../hashing/hashing.service';
import { SignUpDto } from './dto/sign-up.dto/sign-up.dto';
import { SignInDto } from './dto/sign-in.dto/sign-in.dto';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class AuthenticationService {
	constructor( private prisma: PrismaService, private hashingService : HashingService ) {}

	async signUp(signUpDto : SignUpDto ) {
		const user = new User()
		user.email = signUpDto.email
		user.password = await this.hashingService.hash(signUpDto.password)
		return this.prisma.user.create({data:user})
	}

	async signIn (signInDto : SignInDto) {
		const user = await this.prisma.user.findUnique({ where: {
			email: signInDto.email
		}})
		if (!user)
			throw new UnauthorizedException("user doesn't exist")
		const isEquall = this.hashingService.compare(signInDto.password, user.password)
		if (!isEquall)
			throw new UnauthorizedException("wrong password")
		return true
	}
}
