import { $Enums } from "@prisma/client";

export interface UploadedFile  {
	name: string;
	url: string;
	size:number;
	mimeType:string;
	type: $Enums.fileType;

}
