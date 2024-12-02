import { Module } from "@nestjs/common";
import { PaymentController } from "./payment.controller";
import { PaymentService } from "@/modules/payment/payment.service";
import { UserModule } from "@/modules/user/user.module";
import { ProductModule } from "@/modules/product/product.module";

@Module({
  imports: [UserModule, ProductModule],
  controllers: [PaymentController],
  providers: [PaymentService],
})
export class PaymentModule {}
