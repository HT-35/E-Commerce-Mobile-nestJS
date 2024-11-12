import { Module } from "@nestjs/common";
import { UserService } from "./user.service";
import { UserController } from "./user.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { User, UserSchema } from "@/modules/user/schema/user.schema";
import { ProductModule } from "@/modules/product/product.module";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    ProductModule,
  ],
  controllers: [UserController],
  providers: [UserService],

  exports: [UserService],
})
export class UserModule {}
