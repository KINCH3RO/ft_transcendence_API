import {
  Controller,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Query,
  Req,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { UploadService } from './upload.service';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { Public } from 'src/iam/authentication/decorators/public.decorator';
import { createWriteStream, existsSync, writeSync } from 'fs';
import { UploadedFile } from './uploaded-file/uploaded-file.interface';

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Public()
  @Post('/:dir')
  @UseInterceptors(AnyFilesInterceptor())
  uploadFile(
    @Req() req,
    @UploadedFiles() files: Express.Multer.File[],
    @Param('dir') uploadDir: string,
  ) {
    if (!files) throw new HttpException('forbidden', HttpStatus.FORBIDDEN);
    const allowedDirs = ['banners', 'avatars', 'messages', 'channels'];
    if (!process.env.UPLOAD_DIR) {
      console.error('Error : Add UPLOAD_DIR to your environment');
      throw new HttpException('Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
    if (!allowedDirs.includes(uploadDir))
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    let Files: UploadedFile[] = [];
    for (let i = 0; i < files.length; i++) {
      let fileName = this.uploadService.genRandomFileName(
        files[i].originalname,
      );
      let fileDir = process.env.UPLOAD_DIR + uploadDir + '/' + fileName;
      while (existsSync(fileDir)) {
        fileName = this.uploadService.genRandomFileName(files[i].originalname);
        fileDir = process.env.UPLOAD_DIR + uploadDir + '/' + fileName;
      }
      Files.push(this.uploadService.writeFile(fileDir, files[i]));
    }
    return Files;
  }
}
