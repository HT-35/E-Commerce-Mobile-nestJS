import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { BrandService } from './brand.service';

import { FileInterceptor } from '@nestjs/platform-express';
import mongoose from 'mongoose';

@Controller('brand')
export class BrandController {
  constructor(private readonly brandService: BrandService) {}

  @UseInterceptors(FileInterceptor('file'))
  @Post('')
  create(
    @UploadedFile() file: Express.Multer.File,
    @Body('name') name: string,
  ) {
    if (!file) {
      throw new BadRequestException('Missing Img !!');
    }
    return this.brandService.Create(file, name);
  }

  @Get()
  findAll() {
    return this.brandService.findAll();
  }

  @UseInterceptors(FileInterceptor('file'))
  @Patch(':id')
  update(
    @UploadedFile() file: Express.Multer.File,
    @Body('name') name: string,
    @Param('id') id: mongoose.Types.ObjectId,
  ) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException('id phải là có type ObjectId');
    }
    return this.brandService.update(file, name, id);
  }

  @Delete(':id')
  remove(@Param('id') id: mongoose.Types.ObjectId) {
    console.log('id:', id);
    return this.brandService.remove(id);
  }
}
