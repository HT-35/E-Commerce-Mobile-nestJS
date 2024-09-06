import { BadRequestException, Injectable } from '@nestjs/common';
import { UploadApiErrorResponse, UploadApiResponse, v2 } from 'cloudinary';
import { Readable } from 'stream';

@Injectable()
export class CloudinaryService {
  async uploadImage(
    file: Express.Multer.File,
    folder: string,
  ): Promise<UploadApiResponse | UploadApiErrorResponse> {
    return new Promise((resolve, reject) => {
      const upload = v2.uploader.upload_stream(
        {
          folder,
          transformation: [{ quality: 25 }, { fetch_format: 'auto' }],
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        },
      );

      // Tạo stream từ buffer và pipe nó vào Cloudinary
      Readable.from(file.buffer).pipe(upload);
    });
  }

  async deleteImage(public_id: string) {
    try {
      return await v2.uploader.destroy(public_id);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
