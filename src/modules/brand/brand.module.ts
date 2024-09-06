import { Module } from "@nestjs/common";
import { BrandService } from "./brand.service";
import { BrandController } from "./brand.controller";
import { CloudinaryModule } from "@/cloundinary/cloundinary.module";
import { MongooseModule } from "@nestjs/mongoose";
import { Brand, BrandSchema } from "@/modules/brand/schema/brand.schema";

@Module({
  imports: [
    CloudinaryModule,

    MongooseModule.forFeature([
      {
        name: Brand.name,
        schema: BrandSchema,
      },
    ]),
  ],
  controllers: [BrandController],
  providers: [BrandService],
})
export class BrandModule {}
