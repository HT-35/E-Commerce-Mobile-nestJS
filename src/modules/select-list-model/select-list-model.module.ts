import { Module } from '@nestjs/common';
import { SelectListModelService } from './select-list-model.service';
import { SelectListModelController } from './select-list-model.controller';

@Module({
  controllers: [SelectListModelController],
  providers: [SelectListModelService],
})
export class SelectListModelModule {}
