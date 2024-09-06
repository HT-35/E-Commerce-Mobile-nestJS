import { InjectModel } from '@nestjs/mongoose';
import { BadRequestException, Injectable } from '@nestjs/common';

import { CloudinaryService } from '@/cloundinary/cloundinary.service';
import { TypeFolderClouldinary } from '@/utils/constants';
import { Brand } from '@/modules/brand/schema/brand.schema';
import mongoose, { Model } from 'mongoose';

@Injectable()
export class BrandService {
  constructor(
    @InjectModel(Brand.name) private bandModel: Model<Brand>,
    private cloudinary: CloudinaryService,
  ) {}

  async Create(file: Express.Multer.File, name: string) {
    const brand = await this.bandModel.findOne({
      name: { $regex: new RegExp(name, 'i') },
    });

    if (brand) throw new BadRequestException('Brand đã tồn tại');

    try {
      const sendImgCloundinary = await this.cloudinary.uploadImage(
        file,
        TypeFolderClouldinary.BRAND,
      );

      const createBrand = await this.bandModel.create({
        name,
        cloudinary_id: sendImgCloundinary.public_id,
        img: sendImgCloundinary.url,
      });

      await this.bandModel.syncIndexes();

      return createBrand;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async findOne(_id: mongoose.Types.ObjectId) {
    const brand = await this.bandModel.findOne({ _id });

    //const brand = await this.bandModel.findOne({
    //  $or: [{ _id: id }, { name: { $regex: new RegExp(name, 'i') } }],
    //});

    if (!brand) {
      throw new BadRequestException('Not Found Brand !!');
    }

    return brand;
  }
  async findAll() {
    return await this.bandModel.find();
  }

  async update(
    file: Express.Multer.File,
    name: string,
    id: mongoose.Types.ObjectId,
  ) {
    const brand: any = await this.findOne(id);
    try {
      //delete img in cloudinary
      const deleteImg = await this.cloudinary.deleteImage(brand.cloudinary_id);

      //return deleteImg;
      if (deleteImg.result === 'ok') {
        const newImg = await this.cloudinary.uploadImage(
          file,
          TypeFolderClouldinary.BRAND,
        );
        await this.bandModel.updateOne(
          {
            _id: id,
          },
          {
            name: name,
            cloudinary_id: newImg.public_id,
            img: newImg.url,
          },
        );
        await this.bandModel.syncIndexes();
        return await this.findOne(id);
      }
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async remove(_id: mongoose.Types.ObjectId) {
    const brand: any = await this.findOne(_id);
    try {
      //delete img in cloudinary
      await this.cloudinary.deleteImage(brand.cloudinary_id);

      await this.bandModel.deleteOne({ _id });
      return { delete_successfull: brand };
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
