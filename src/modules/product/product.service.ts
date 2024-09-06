import { InjectModel } from '@nestjs/mongoose';
import { BadRequestException, Injectable } from '@nestjs/common';

import mongoose, { Model } from 'mongoose';
import { Product } from '@/modules/product/schema/product-model.schema';
import { CreateProductDto } from '@/modules/product/dto/create-product-model.dto';
import { UpdateProductModelDto } from '@/modules/product/dto/update-product-model.dto';
import aqp from 'api-query-params';
import { CommentDTO } from '@/modules/product/dto/CommentDTO.dto';
import { ReplyCommentDTO } from '@/modules/product/dto/RepCommentDTO.dto';
import { CloudinaryService } from '@/cloundinary/cloundinary.service';
import { TypeFolderClouldinary } from '@/utils/constants';

@Injectable()
export class ProductModelService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<Product>,
    private cloudinaryService: CloudinaryService,
  ) {}

  async create(CreateProductDto: CreateProductDto) {
    try {
      const namePhone = CreateProductDto.name.split(' ').join('-');

      const slug = `${namePhone}-${CreateProductDto.ram}-${CreateProductDto.rom}`;

      const createProduct = await this.productModel.create({
        ...CreateProductDto,
        slug,
      });
      // Đồng bộ hóa các chỉ mục của mô hình trong cơ sở dữ liệu
      await this.productModel.syncIndexes();

      return createProduct;
    } catch (error) {
      if (error.code === 11000) {
        throw new BadRequestException(
          `sản phẩm  ${error.keyValue.slug} đã tồn tại`,
        );
      }
      throw new BadRequestException(error);
    }
  }

  //  ======== Find All Product

  async findAll(query: string, current: number, pageSize: number) {
    const { filter, sort } = aqp(query);

    if (filter.current) delete filter.current;
    if (filter.pageSize) delete filter.pageSize;

    if (!current) current = 1;
    if (!pageSize) pageSize = 10;

    // đếm tổng số lượng bản ghi vd có 10 bản ghi
    const totalItem = (await this.productModel.find(filter)).length;

    // tính tổng số trang : ví dụ 1 trang có 2 bản ghi thì : 10/2 = 5 trang
    const totalPages = Math.ceil(totalItem / pageSize);

    // ví dự trang 1 thì sẽ bỏ qua 0 bản ghi, trang 2 thì sẽ bỏ qua : (2-1) * 10 =10, vậy là bỏ qua từ bản ghi 1 -> bản ghi 10
    const skip = (current - 1) * pageSize;

    const result = await this.productModel
      .find(filter)
      .limit(pageSize)
      .skip(skip)
      .select('-password -createdAt -updatedAt') // loại bỏ trường password
      .sort(sort as any);

    return { result, totalPages };
  }

  async findOne(slug: string) {
    const product = await this.productModel.findOne({ slug });

    if (!product) {
      throw new BadRequestException('Not Found Product !');
    }

    return product;
  }

  async filterProductByType(type: string) {
    try {
      return await this.productModel.find({ type });
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async update(slug: string, updateProductModelDto: UpdateProductModelDto) {
    const product = await this.findOne(slug);

    try {
      if (
        updateProductModelDto.name ||
        updateProductModelDto.ram ||
        updateProductModelDto.rom
      ) {
        const namePhone =
          updateProductModelDto?.name.split(' ').join('-') ?? product.name;

        const ram = updateProductModelDto.ram ?? product.ram;
        const rom = updateProductModelDto.rom ?? product.rom;

        const newSlug = `${namePhone}-${ram}-${rom}`;

        await this.productModel.updateOne(
          { slug },
          { ...updateProductModelDto, slug: newSlug },
        );
        await this.productModel.syncIndexes();

        return await this.findOne(newSlug);
      } else {
        await this.productModel.updateOne({ slug }, { updateProductModelDto });
        await this.productModel.syncIndexes();
        return await this.findOne(slug);
      }
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async remove(slug: string) {
    const produc = await this.findOne(slug);

    await this.cloudinaryService.deleteImage(produc.cloudinary_id);

    try {
      const removeProduct = await this.productModel.deleteOne({ slug });
      if (removeProduct.deletedCount > 0) {
        return {
          delete: produc,
        };
      }
    } catch (error) {
      throw new BadRequestException(error);
    }

    return `This action removes a #${slug} productModel`;
  }

  async SearchProduct(name: string) {
    try {
      const product = await this.productModel.find({
        name: { $regex: name, $options: 'i' },
      });

      if (product?.length === 0) {
        return { message: ' khong tim thay sp' };
      }
      return product;
    } catch (error) {
      console.log('error:', error);
      throw new BadRequestException(error);
    }
  }

  async blogProduct(contenBlog: any, slug: string) {
    const product = await this.findOne(slug);

    try {
      product.blog = contenBlog;
      await product.save();
      return await this.findOne(slug);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async CommentProduct(slug: any, comment: CommentDTO) {
    console.log('comment:', comment);
    const product = await this.findOne(slug);

    try {
      product.comments.push(comment);

      const updateCommentProduct = await product.save();
      return updateCommentProduct;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
  async ReplyCommentProduct(slug: any, comment: ReplyCommentDTO) {
    const product = await this.findOne(slug);

    const _idComnent = new mongoose.Types.ObjectId(comment.idComment);
    //const _idComnent = 123;

    const findIndexComment = product.comments.findIndex((item: any) => {
      return item._id.equals(_idComnent);
    });

    if (findIndexComment === -1) {
      throw new BadRequestException('Not Found Comment !');
    }
    try {
      await product.comments[findIndexComment].replies.push(comment);

      const newReplyCommnent = await product.save();

      return newReplyCommnent;

      //product.comments.push(comment);
      //const updateCommentProduct = await product.save();
      //return updateCommentProduct;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async uploadImg(file: Express.Multer.File) {
    return await this.cloudinaryService.uploadImage(
      file,
      TypeFolderClouldinary.PRODUCT,
    );
  }
}
