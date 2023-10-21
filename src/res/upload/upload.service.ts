import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { $Enums } from '@prisma/client';
import { randomUUID } from 'crypto';
import { createWriteStream, mkdir } from 'fs';
import { UploadedFile } from './uploaded-file/uploaded-file.interface';

@Injectable()
export class UploadService implements OnApplicationBootstrap {
  onApplicationBootstrap() {
    mkdir('public/upload/banners', { recursive: true }, (err) => {});
    mkdir('public/upload/avatars', { recursive: true }, (err) => {});
    mkdir('public/upload/messages', { recursive: true }, (err) => {});
    mkdir('public/upload/channels', { recursive: true }, (err) => {});
  }

  genRandomFileName(fileName: string) {
    let fileExtension = fileName.includes('.')
      ? '.' + fileName.split('.').pop()
      : '';
    let newFileName: string = randomUUID();
    newFileName = newFileName.replace('-', '');
    newFileName = newFileName.slice(0, 10);
    newFileName += fileExtension;
    return newFileName;
  }

  writeFile(fileName: string, file: Express.Multer.File): UploadedFile {
    let writeStream = createWriteStream(fileName);
    writeStream.write(file.buffer);
    writeStream.close();
    return {
      mimeType: file.mimetype,
      name: file.originalname,
      size: file.size,
      type: this.detectType(file.originalname),
      url: fileName.replace('public/', ''),
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
}
