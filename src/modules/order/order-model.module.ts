import { Module } from "@nestjs/common";
import { OrderModelService } from "./order-model.service";
import { OrderModelController } from "./order-model.controller";

@Module({
  controllers: [OrderModelController],
  providers: [OrderModelService],
})
export class OrderModelModule {}
