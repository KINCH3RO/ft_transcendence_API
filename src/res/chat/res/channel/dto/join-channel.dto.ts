import { IsOptional, IsString, IsUUID, isString, isUUID } from "class-validator";

export class JoinChannelDto {
	@IsUUID()
	channelID: string;

	@IsString()
	@IsOptional()
  password: string;
}
