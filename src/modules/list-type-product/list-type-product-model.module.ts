import { ListTypeProductModelController } from "@/modules/list-type-product/list-type-product-model.controller";
import { ListTypeProductModelService } from "@/modules/list-type-product/list-type-product-model.service";
import { Module } from "@nestjs/common";

@Module({
  controllers: [ListTypeProductModelController],
  providers: [ListTypeProductModelService],
})
export class ListTypeProductModelModule {}
