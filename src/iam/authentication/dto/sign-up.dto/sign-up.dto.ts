import { IsEmail,IsNotEmpty,MinLength } from "class-validator"

export class SignUpDto {
	@IsNotEmpty()
	fullname: string

	@IsNotEmpty()
	username: string

	@IsEmail()
	email: string;

	@MinLength(10)
	password: string;
}
