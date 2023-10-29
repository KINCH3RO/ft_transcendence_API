import { IsNumber, IsOptional, IsString, isNumber } from "class-validator"


export class findMessageDto {
	@IsString()
	@IsOptional()
	channelID?: string
	@IsString()
	@IsOptional()
	dmID?: string

	@IsNumber()
	offset: number
	@IsNumber()
	limit: number

}
