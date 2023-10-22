import { IsOptional, IsString, IsUUID, isString, isUUID } from "class-validator";

export class JoinChannelDto {
	@IsString()
	@IsOptional()
  password: string;
}
