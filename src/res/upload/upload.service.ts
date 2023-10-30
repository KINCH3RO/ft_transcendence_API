import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { $Enums } from '@prisma/client';
import { randomUUID } from 'crypto';
import { createWriteStream, existsSync, mkdir, writeFileSync } from 'fs';
import { UploadedFile } from './uploaded-file/uploaded-file.interface';

@Injectable()
export class UploadService implements OnApplicationBootstrap {
	onApplicationBootstrap() {
		mkdir('public/upload/banners', { recursive: true }, (err) => { });
		mkdir('public/upload/avatars', { recursive: true }, (err) => { });
		mkdir('public/upload/messages', { recursive: true }, (err) => { });
		mkdir('public/upload/channels', { recursive: true }, (err) => { });
	}

	private genRandomFileName(fileName: string) {
		let fileExtension = fileName.includes('.')
			? '.' + fileName.split('.').pop()
			: '';
		let newFileName: string = randomUUID();
		newFileName = newFileName.replace('-', '');
		newFileName = newFileName.slice(0, 10);
		newFileName += fileExtension;
		return newFileName;
	}

	private writeFile(fileName: string, file: Express.Multer.File): UploadedFile {
		writeFileSync(process.cwd() + fileName, file.buffer);


		return {
			mimeType: file.mimetype,
			name: file.originalname,
			size: file.size,
			type: this.detectType(file.originalname),
			url: process.env.URL_PREFIX + fileName.replace('public/', ''),
		};
	}

	private detectType(fileName: string) {
		let imageExtensions = ['png', 'jpg', 'jpeg', 'gif'];
		let videoExtension = ['mp4', 'webm', 'ogg'];
		let fileExtension = fileName.includes('.') ? fileName.split('.').pop() : '';
		if (imageExtensions.includes(fileExtension)) return $Enums.fileType.IMAGE;
		else if (videoExtension.includes(fileExtension))
			return $Enums.fileType.VIDEO;
		else return $Enums.fileType.FILE;
	}


	uploadProcess(files: Express.Multer.File[], uploadDir: string) {
		let Files: UploadedFile[] = [];
		for (let i = 0; i < files.length; i++) {
			let fileName = this.genRandomFileName(
				files[i].originalname,
			);
			let fileDir = process.env.UPLOAD_DIR + uploadDir + '/' + fileName;
			while (existsSync(process.cwd() + fileDir)) {
				fileName = this.genRandomFileName(files[i].originalname);
				fileDir = process.env.UPLOAD_DIR + uploadDir + '/' + fileName;
			}
			Files.push(this.writeFile(fileDir, files[i]));
		}
		return Files;
	}



}
