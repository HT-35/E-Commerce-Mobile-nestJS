import { InjectModel } from "@nestjs/mongoose";
import { BadRequestException, Injectable } from "@nestjs/common";

import mongoose, { Model } from "mongoose";
import { Product } from "@/modules/product/schema/product-model.schema";
import { CreateProductDto } from "@/modules/product/dto/create-product-model.dto";
//import { UpdateProductModelDto } from "@/modules/product/dto/update-product-model.dto";
import aqp from "api-query-params";
import { CommentDTO } from "@/modules/product/dto/CommentDTO.dto";
import { ReplyCommentDTO } from "@/modules/product/dto/RepCommentDTO.dto";
import { CloudinaryService } from "@/cloundinary/cloundinary.service";
import { TypeFolderClouldinary } from "@/utils/constants";
import slugify from "slugify";

@Injectable()
export class ProductModelService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<Product>,
    private cloudinaryService: CloudinaryService,
  ) {}

  // Hàm loại bỏ dấu thủ công
  removeVietnameseTones(str: string): string {
    return str
      .normalize("NFD") // Chuẩn hóa ký tự Unicode
      .replace(/[\u0300-\u036f]/g, "") // Loại bỏ dấu
      .replace(/đ/g, "d") // Thay ký tự đ
      .replace(/Đ/g, "D") // Thay ký tự Đ
      .trim(); // Loại bỏ khoảng trắng thừa
  }

  async create(CreateProductDto: CreateProductDto) {
    try {
      // Loại bỏ khoảng trắng trong ram và rom
      const ram = CreateProductDto.ram.replace(/\s+/g, ""); // Xóa tất cả khoảng trắng
      const rom = CreateProductDto.rom.replace(/\s+/g, ""); // Xóa tất cả khoảng trắng

      const namePhone = slugify(
        this.removeVietnameseTones(CreateProductDto.name),
        {
          lower: true,
          remove: /[*+~.()'"!:@]/g, // Loại bỏ các ký tự đặc biệt
        },
      );

      const slug = `${namePhone}-${ram}-${rom}`;

      const createProduct = await this.productModel.create({
        ...CreateProductDto,
        ram, // Gán lại giá trị đã được loại bỏ khoảng trắng
        rom, // Gán lại giá trị đã được loại bỏ khoảng trắng
        slug,
      });

      // Đồng bộ hóa các chỉ mục của mô hình trong cơ sở dữ liệu
      await this.productModel.syncIndexes();

      return createProduct;
    } catch (error) {
      if (error.code === 11000) {
        throw new BadRequestException(
          `Sản phẩm ${error.keyValue.slug} đã tồn tại`,
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
      .select("-password -createdAt -updatedAt") // loại bỏ trường password
      .sort(sort as any);

    return { result, totalPages };
  }

  async findOne(slug: string) {
    const regex = new RegExp(slug, "i");
    const product = await this.productModel.findOne({ slug: regex });

    if (!product) {
      throw new BadRequestException("Not Found Product !");
    }

    return product;
  }

  async filterProductByType(brand: string) {
    const regex = new RegExp(brand, "i");
    try {
      return await this.productModel.find({ brand: regex });
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async update(slug: string, updateProductModelDto: any) {
    const product = await this.findOne(slug);

    try {
      if (
        updateProductModelDto.name ||
        updateProductModelDto.ram ||
        updateProductModelDto.rom
      ) {
        const namePhone =
          updateProductModelDto?.name.split(" ").join("-") ?? product.name;

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
        await this.productModel.updateOne(
          { slug },
          { ...updateProductModelDto },
        );
        await this.productModel.syncIndexes();
        return await this.findOne(slug);
      }
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async remove(slug: string) {
    const produc = await this.findOne(slug);

    await Promise?.all(
      produc?.option?.map(async (item) => {
        for (const imgItem of item?.img) {
          await this?.cloudinaryService?.deleteImage(imgItem.cloudinary_id);
        }
      }),
    );

    try {
      const removeProduct = await this.productModel.deleteOne({ slug });
      if (removeProduct.deletedCount > 0) {
        return {
          delete: produc,
        };
      }
      return produc;
    } catch (error) {
      throw new BadRequestException(error);
    }

    return `This action removes a #${slug} productModel`;
  }

  async SearchProduct(name: string) {
    try {
      const product = await this.productModel.find({
        name: { $regex: name, $options: "i" },
      });

      if (product?.length === 0) {
        return { message: " khong tim thay sp" };
      }
      return product;
    } catch (error) {
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
      throw new BadRequestException("Not Found Comment !");
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

  async uploadImg(files: Express.Multer.File[]) {
    const arrFile = await Promise?.all(
      files?.map(async (item) => {
        const img = await this?.cloudinaryService?.uploadImage(
          item,
          TypeFolderClouldinary?.PRODUCT,
        );

        return {
          link: img?.secure_url,
          cloudinary_id: img?.public_id,
        };
      }),
    );

    return arrFile;
  }
}
