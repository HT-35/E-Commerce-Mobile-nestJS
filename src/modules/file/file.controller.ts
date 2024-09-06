import {
  Controller,
  Post,
  UseInterceptors,
  HttpException,
  HttpStatus,
  UploadedFiles,
} from '@nestjs/common';

import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('file')
export class FileController {
  @Post('upload')
  @UseInterceptors(
    FileFieldsInterceptor(
      // pipe
      [
        { name: 'img', maxCount: 5 },
        { name: 'pdf', maxCount: 1 },
      ],
      {
        // config path
        storage: diskStorage({
          destination: (req, file, callback) => {
            if (file.fieldname === 'img') {
              callback(null, './uploads/img');
            } else if (file.fieldname === 'pdf') {
              callback(null, './uploads/pdf');
            }
          },
          filename: (req, file, callback) => {
            const randomName = Array(5)
              .fill(null)
              .map(() => Math.round(Math.random() * 16).toString(16))
              .join('');
            //Calling the callback passing the random name generated with the original extension name
            callback(null, `${randomName}-${file.originalname}`);
          },
        }),
        // config name IMG
        fileFilter: (req, file, cb) => {
          if (
            file.fieldname === 'img' &&
            file.mimetype.match(/\/(jpg|jpeg|png)$/)
          ) {
            cb(null, true);
          } else if (
            file.fieldname === 'pdf' &&
            file.mimetype.match(/\/(pdf)$/)
          ) {
            cb(null, true);
          } else {
            // Reject file
            cb(
              new HttpException(
                `Unsupported file type ${extname(file.originalname)}`,
                HttpStatus.BAD_REQUEST,
              ),
              false,
            );
          }
        },
      },
    ),
  )
  create(
    @UploadedFiles()
    files: {
      img?: Express.Multer.File[];
      pdf?: Express.Multer.File[];
    },
  ) {
    return files;
  }
}
