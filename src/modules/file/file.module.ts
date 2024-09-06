import { FileController } from '@/modules/file/file.controller';
import { Module } from '@nestjs/common';

@Module({
  controllers: [FileController],
})
export class FileModule {}
