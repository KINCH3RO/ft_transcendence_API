import { IsNotEmpty,MinLength } from "class-validator"

export class SignInDto {
	@IsNotEmpty()
	username: string;

	@MinLength(10)
	password: string;
}
