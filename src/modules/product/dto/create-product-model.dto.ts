import {
  IsString,
  IsNumber,
  IsBoolean,
  IsOptional,
  ValidateNested,
  IsArray,
  IsMongoId,
} from 'class-validator';
import { Type } from 'class-transformer';

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
  @IsString()
  name: string;

  @IsNumber()
  price: number;

  @IsNumber()
  salePrice: number;

  @IsString()
  type: string;

  @IsOptional()
  @IsString()
  image?: string;

  @IsOptional()
  @IsNumber()
  amount?: number;

  @IsOptional()
  @IsString()
  cloudinary_id?: string;

  @IsOptional()
  @IsNumber()
  rating?: number;

  @IsOptional()
  @IsNumber()
  numReviews?: number;

  @IsOptional()
  @IsString()
  blog?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateReviewProductDto)
  reviews: CreateReviewProductDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateCommentProductDto)
  comments: CreateCommentProductDto[];

  @IsOptional()
  @IsString()
  os?: string;

  @IsOptional()
  @IsString()
  ram?: string;

  @IsOptional()
  @IsString()
  battery?: string;

  @IsOptional()
  @IsString()
  rom?: string;

  @IsOptional()
  @IsString()
  camera?: string;

  @IsOptional()
  @IsString()
  special?: string;

  @IsOptional()
  @IsString()
  design?: string;

  @IsOptional()
  @IsString()
  screen?: string;
}
