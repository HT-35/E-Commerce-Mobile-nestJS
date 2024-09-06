import {
  IsString,
  IsNumber,
  IsBoolean,
  IsOptional,
  ValidateNested,
  IsArray,
  IsMongoId,
  IsNotEmpty,
} from "class-validator";
import { Type } from "class-transformer";

class CreateReviewProductDto {
  @IsString()
  name: string;

  @IsString()
  comment: string;

  @IsNumber()
  star: number;
}

class CreateReplieCommentProductDto {
  @IsString()
  content: string;

  @IsBoolean()
  isAdmin: boolean;

  @IsString()
  nameUser: string;

  @IsMongoId()
  byUser: string; // Sử dụng string vì DTO không làm việc trực tiếp với ObjectId của mongoose
}

class CreateCommentProductDto {
  @IsString()
  author: string;

  @IsString()
  status: string;

  @IsBoolean()
  isAdmin: boolean;

  @IsString()
  avatar: string;

  @IsString()
  content: string;

  @IsMongoId()
  byUser: string; // Sử dụng string vì DTO không làm việc trực tiếp với ObjectId của mongoose

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateReplieCommentProductDto)
  replies: CreateReplieCommentProductDto[];
}

export class CreateProductDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsNumber()
  price: number;

  @IsNotEmpty()
  @IsNumber()
  salePrice: number;

  @IsNotEmpty()
  @IsString()
  type: string;

  @IsNotEmpty()
  @IsString()
  image: string;

  @IsNotEmpty()
  @IsString()
  cloudinary_id: string;

  @IsNotEmpty()
  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @IsOptional()
  @IsString()
  blog?: string;

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CreateReviewProductDto)
  reviews?: CreateReviewProductDto[];

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CreateCommentProductDto)
  comments?: CreateCommentProductDto[];

  @IsNotEmpty()
  @IsString()
  os: string;

  @IsNotEmpty()
  @IsString()
  ram: string;

  @IsNotEmpty()
  @IsString()
  battery: string;

  @IsNotEmpty()
  @IsString()
  rom: string;

  @IsNotEmpty()
  @IsString()
  camera: string;

  @IsNotEmpty()
  @IsString()
  special: string;

  @IsNotEmpty()
  @IsString()
  design: string;

  @IsNotEmpty()
  @IsString()
  screen: string;
}
