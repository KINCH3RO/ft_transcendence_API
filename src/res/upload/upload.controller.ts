import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Query,
  Req,
  Res,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { UploadService } from './upload.service';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { Public } from 'src/iam/authentication/decorators/public.decorator';
import { createWriteStream, existsSync, writeSync } from 'fs';
import { UploadedFile } from './uploaded-file/uploaded-file.interface';
import { join, resolve } from 'path';
import { Response } from 'express';

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}


  @Public()
  @Get(":dir/:file")
  resFiles(@Res() res: Response, @Param("dir") dir: string, @Param("file") file: string) {


	  const allowedDirs = ['banners', 'avatars', 'messages', 'channels'];
	  if (!allowedDirs.includes(dir))
	  {
		  res.status(HttpStatus.FORBIDDEN).send("Forbidden");
		  return;
	  }

	  res.sendFile(file, { root: join('public', 'upload', dir) }, (err) => {
		  if(err)
		  res.status(HttpStatus.NOT_FOUND).send("file not found");
	  });

  }

  @Public()
  @Post('/:dir')
  @UseInterceptors(AnyFilesInterceptor())
  async uploadFile(
    @UploadedFiles() files: Express.Multer.File[],
    @Param('dir') uploadDir: string,
  ) {
    const allowedDirs = ['banners', 'avatars', 'messages', 'channels'];
    if (!files) throw new HttpException('forbidden', HttpStatus.FORBIDDEN);
    if (!process.env.UPLOAD_DIR) {
      console.error('Error : Add UPLOAD_DIR to your environment');
      throw new HttpException('Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
    if (!allowedDirs.includes(uploadDir))
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    let uploadedFiles: UploadedFile[] = this.uploadService.uploadProcess(
      files,
      uploadDir,
    );

    await new Promise((resolve) => setTimeout(resolve, 1500));
    return uploadedFiles;
  }
}
