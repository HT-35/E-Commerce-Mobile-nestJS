import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";

export type ProductDocument = HydratedDocument<Product>;

@Schema({ timestamps: true })
class Option {
  color: string;
  price: string;

  amount: number;

  img: [
    {
      link: string;
      cloudinary_id: string;
    },
  ];
}

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

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "User", required: true })
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

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "User", required: true })
  byUser: mongoose.Schema.Types.ObjectId;

  @Prop({ type: [ReplieCommentProduct], default: [] })
  replies: ReplieCommentProduct[];
}

@Schema({ timestamps: true })
export class Product {
  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: String, required: true })
  brand: string;

  //@Prop({ type: Number })
  //amount: number;

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
  chip: string;
  @Prop({ type: String })
  sim: string;
  @Prop({ type: String })
  design: string;

  @Prop({ type: String })
  cameraBefore: string;

  @Prop({ type: String })
  cameraAfter: string;

  @Prop({ type: String })
  special: string;

  @Prop({ type: String })
  screen: string;

  @Prop({})
  option: Option[];

  // system generator  =  name  + ram  + rom
  @Prop({ type: String, required: true, unique: true })
  slug: string;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
