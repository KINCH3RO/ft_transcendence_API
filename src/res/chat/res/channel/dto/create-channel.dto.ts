import { $Enums } from "@prisma/client";
import { IsNotEmpty, IsOptional, IsUrl, MinLength } from "class-validator";

export class CreateChannelDto {
	imageUrl: string;

	@IsNotEmpty()
	name: string;

	@MinLength(8)
	@IsOptional()
	password?: string;

	@IsNotEmpty()
	visibility: $Enums.channelVisibility;
}
