import { IsPublic } from "./../../public/DecoratorCustom";
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  BadGatewayException,
  UseInterceptors,
  BadRequestException,
  UploadedFiles,
} from "@nestjs/common";

import { CreateProductDto } from "@/modules/product/dto/create-product-model.dto";
//import { UpdateProductModelDto } from "@/modules/product/dto/update-product-model.dto";
import { ResponseMessage, Roles, Roles_Type } from "@/public/DecoratorCustom";
import { CommentDTO } from "@/modules/product/dto/CommentDTO.dto";
import { ReplyCommentDTO } from "@/modules/product/dto/RepCommentDTO.dto";
import { ProductModelService } from "@/modules/product/product.service";
import { FilesInterceptor } from "@nestjs/platform-express";

@Controller("product")
export class ProductModelController {
  constructor(private readonly productModelService: ProductModelService) {}

  @Get()
  //@Roles(Roles_Type.ADMIN, Roles_Type.USER)
  @IsPublic()
  @ResponseMessage("Find All Product")
  findAll(
    @Query() query: string,
    @Query("current") current: number,
    @Query("pageSize") pageSize: number,
  ) {
    return this.productModelService.findAll(query, current, pageSize);
  }

  @Post()
  @Roles(Roles_Type.ADMIN)
  @ResponseMessage("Create Product")
  create(@Body() CreateProductDto: CreateProductDto) {
    //return req.user;

    return this.productModelService.create(CreateProductDto);
  }

  @Patch(":slug")
  @ResponseMessage("Update Product")
  update(@Param("slug") slug: string, @Body() updateProductModelDto: any) {
    if (Object.values(updateProductModelDto).length === 0) {
      throw new BadGatewayException(
        "Phải gửi tối thiểu 1 trường để cập nhật sản phẩm !",
      );
    }
    return this.productModelService.update(slug, updateProductModelDto);
  }

  @Get("search")
  @IsPublic()
  SearchProduct(@Query("name") name: string) {
    return this.productModelService.SearchProduct(name);
  }

  @Get(":slug")
  @IsPublic()
  @ResponseMessage("Find One By Slug")
  findOne(@Param("slug") slug: string) {
    return this.productModelService.findOne(slug);
  }

  @Get("brand/:brand")
  @IsPublic()
  @ResponseMessage("Filter Product By Brand !")
  filterProductByType(@Param("brand") brand: string) {
    return this.productModelService.filterProductByType(brand);
  }

  @Post("/blog/:slug")
  @ResponseMessage("Writte Blog for Product")
  BlogProduct(
    @Body("contenBlog") contenBlog: any,
    @Param("slug") slug: string,
  ) {
    return this.productModelService.blogProduct(contenBlog, slug);
  }

  @Post("/comment/:slug")
  @ResponseMessage("Comment of Product")
  CommentProduct(@Param("slug") slug: any, @Body() comment: CommentDTO) {
    return this.productModelService.CommentProduct(slug, comment);
  }

  @Post("reply/comment/:slug")
  @ResponseMessage("Comment of Product")
  ReplyCommentProduct(
    @Param("slug") slug: any,
    @Body() comment: ReplyCommentDTO,
  ) {
    return this.productModelService.ReplyCommentProduct(slug, comment);
  }

  @Delete(":slug")
  @ResponseMessage("Delete Product !")
  remove(@Param("slug") slug: string) {
    return this.productModelService.remove(slug);
  }

  @Post("/img")
  @UseInterceptors(FilesInterceptor("files", 10)) // 'files' là tên của field trong form-data, 4 là số lượng file tối đa
  @ResponseMessage("Img Product")
  uploadImg(@UploadedFiles() files: Express.Multer.File[]) {
    if (!files || files.length === 0) {
      throw new BadRequestException("Missing Img");
    }
    return this.productModelService.uploadImg(files);
    //return "ok";
  }
}
