import { Product } from "@/modules/product/schema/product-model.schema";
import { Roles_Type } from "@/public/DecoratorCustom";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class cartItem {
  @Prop({
    type: String,
    ref: Product.name,
    required: true,
  })
  slug: string;

  @Prop({ required: true })
  quatity: number;
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

  @Prop({ default: Roles_Type.USER })
  roles: Roles_Type;

  // ======================    Cart  =================================
  @Prop({
    type: [cartItem],
    default: [],
  })
  cart: cartItem[];

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
