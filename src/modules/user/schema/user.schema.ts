import { Product } from "@/modules/product/schema/product-model.schema";
import { Roles_Type } from "@/public/DecoratorCustom";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";

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
  color: string;

  @Prop({ required: true })
  quantity: number;
}

@Schema({ timestamps: true })
export class AddressDelivery {
  @Prop({ required: true, type: String })
  province_id: string;
  //@Prop({ required: true, type: String })
  //province_name: string;

  @Prop({ required: true, type: String })
  district_id: string;
  //@Prop({ required: true, type: String })
  //district_name: string;

  @Prop({ required: true, type: String })
  ward_code: string;

  //@Prop({ required: true, type: String })
  //ward_name: string;

  @Prop({ required: true, type: String, unique: true })
  address_detail: string;
}

@Schema({ timestamps: true })
export class itemBill {
  @Prop({
    type: String,
    ref: Product.name,
    required: true,
  })
  slug: string;

  @Prop({
    type: String,
    required: true,
  })
  color: string;

  @Prop({
    type: Number,
    required: true,
  })
  quantity: number;

  @Prop({
    type: Number,
    required: true,
  })
  price: number;
}

@Schema({ timestamps: true })
export class Bill {
  @Prop({
    type: [itemBill],
    default: [],
  })
  itemArr: itemBill[];

  @Prop({
    type: Number,
    required: true,
  })
  total: number;

  @Prop({
    type: mongoose.Types.ObjectId,
    required: true,
  })
  addressShiping: mongoose.Types.ObjectId;
}

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop()
  name: string;

  @Prop()
  password: string;

  @Prop({
    type: [AddressDelivery],
    default: [],
  })
  address: AddressDelivery[];

  @Prop()
  phone: string;

  @Prop({ default: Roles_Type.USER })
  roles: Roles_Type;

  // ======================    Cart  =================================
  @Prop({
    type: [cartItem],
    unique: true,
    default: [],
  })
  cart: cartItem[];

  // ====================  Bill  ==================================
  @Prop({
    type: [Bill],
    unique: true,
    default: [],
  })
  Bill: Bill[];

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
