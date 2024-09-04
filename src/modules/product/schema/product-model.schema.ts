import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type ProductDocument = HydratedDocument<Product>;

@Schema({ timestamps: true })
class ReviewProduct {
  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: String, required: true })
  comment: string;

  @Prop({ type: Number, required: true })
  star: number;
}

@Schema()
class ReplieCommentProduct {
  @Prop({ type: String, required: true })
  content: string;

  @Prop({ type: Boolean, required: true })
  isAdmin: boolean;

  @Prop({ type: String, required: true })
  nameUser: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  byUser: mongoose.Schema.Types.ObjectId;
}

@Schema()
class CommentProduct {
  @Prop({ type: String, required: true })
  author: string;

  @Prop({ type: String })
  status: string;

  @Prop({ type: Boolean })
  isAdmin: boolean;

  @Prop({ type: String })
  avatar: string;

  @Prop({ type: String, required: true })
  content: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  byUser: mongoose.Schema.Types.ObjectId;

  @Prop({ type: [ReplieCommentProduct], default: [] })
  replies: ReplieCommentProduct[];
}

@Schema({ timestamps: true })
export class Product {
  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: Number, required: true })
  price: number;

  @Prop({ type: Number, required: true })
  salePrice: number;

  @Prop({ type: String, required: true })
  type: string;

  @Prop({ type: String })
  image: string;

  @Prop({ type: Number })
  amount: number;

  @Prop({ type: String })
  cloudinary_id: string;

  @Prop({ type: Number })
  rating: number;

  @Prop({ type: Number })
  numReviews: number;

  @Prop({ type: String })
  blog: string;

  @Prop({ type: [ReviewProduct], default: [] })
  reviews: ReviewProduct[];

  @Prop({ type: [CommentProduct], default: [] })
  comments: CommentProduct[];

  @Prop({ type: String })
  os: string;

  @Prop({ type: String })
  ram: string;

  @Prop({ type: String })
  battery: string;

  @Prop({ type: String })
  rom: string;

  @Prop({ type: String })
  camera: string;

  @Prop({ type: String })
  special: string;

  @Prop({ type: String })
  design: string;

  @Prop({ type: String })
  screen: string;

  // system generator  =  name  + ram  + rom
  @Prop({ type: String, required: true, unique: true })
  slug: string;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
