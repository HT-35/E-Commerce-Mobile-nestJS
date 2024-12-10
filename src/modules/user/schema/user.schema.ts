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
    type: String,
    required: true,
  })
  price: string;
  @Prop({
    type: String,
  })
  name: string;
  @Prop({
    type: String,
  })
  brand: string;
  @Prop({
    type: Number,
  })
  calcPrice: number;
}

@Schema({ timestamps: true })
export class Bill {
  @Prop({
    type: [itemBill],
  })
  itemArr: itemBill[];

  @Prop({
    type: String,
  })
  email: string;

  @Prop({
    type: String,
  })
  orderer: string;

  @Prop({
    type: String,
  })
  numberPhone: string;

  @Prop({
    type: String,
  })
  CodeShipGHN: string;

  @Prop({
    enum: ["VNPAY", "COD"],
  })
  paymentMethod: "VNPAY" | "COD";

  @Prop({
    enum: [
      "waiting for payment",
      "pending",
      "paid",
      "shipped",
      "completed",
      "canceled",
    ],
    default: "pending",
  })
  statusShiping:
    | "waiting for payment"
    | "pending"
    | "paid"
    | "shipped"
    | "completed"
    | "canceled";

  @Prop({
    enum: ["paid", "unpaid"],
    default: "unpaid",
  })
  statusPayment: "paid" | "unpaid";

  @Prop({
    type: Number,
    required: true,
  })
  total: number;

  @Prop({
    type: String,
    required: true,
  })
  addressShiping: string;
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
  numberPhone: string;

  @Prop({ default: Roles_Type.USER })
  role: Roles_Type;

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
