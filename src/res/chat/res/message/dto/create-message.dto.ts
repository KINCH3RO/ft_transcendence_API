import { $Enums, attachment, message } from "@prisma/client";
import { IsBoolean, IsNumber, IsObject, IsOptional, IsString, isNumber, isString } from "class-validator";
import { fileType } from "@prisma/client";

export class CreateMessageDto {

	@IsBoolean()
	dmMessage: boolean
	@IsOptional()
	@IsString()
	directmessageID?: string;
	@IsOptional()
	@IsString()
	channelID?: string;
	@IsString()
	content: string;
	@IsOptional()
	@IsObject()
	attachment:
		{

			name: string;
			url: string;
			size: number;
			mimeType: string;
			type: fileType;
		}
}
