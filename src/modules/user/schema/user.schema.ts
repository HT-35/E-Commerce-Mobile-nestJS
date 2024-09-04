import { Product } from '@/modules/product/schema/product-model.schema';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class Cart {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: Product.name,
    default: [],
  })
  id_Product: mongoose.Schema.Types.ObjectId;
}

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop()
  name: string;

  @Prop()
  password: string;

  @Prop()
  address: string;
  @Prop()
  phone: string;

  @Prop({ default: false })
  isAdmin: boolean;

  // ======================    Cart  =================================
  @Prop({})
  cart: [Cart];

  //  ===========================================    Extend ===================================================
  @Prop({ default: false })
  isActive: boolean;

  // chương trình tự sinh 2 trường sau
  @Prop()
  codeId: string;

  @Prop()
  codeExpired: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
