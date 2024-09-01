import { Module } from '@nestjs/common';
import { ListTypeProductModelService } from './list-type-product-model.service';
import { ListTypeProductModelController } from './list-type-product-model.controller';

@Module({
  controllers: [ListTypeProductModelController],
  providers: [ListTypeProductModelService],
})
export class ListTypeProductModelModule {}
