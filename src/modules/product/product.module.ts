import { Module } from '@nestjs/common';
import { ProductModelService } from './product.service';
import { ProductModelController } from './product.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Product,
  ProductSchema,
} from '@/modules/product/schema/product-model.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }]),
  ],
  controllers: [ProductModelController],
  providers: [ProductModelService],
})
export class ProductModule {}
