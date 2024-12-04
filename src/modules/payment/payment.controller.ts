import { Body, Controller, Post, Req } from "@nestjs/common";

import { PaymentService } from "@/modules/payment/payment.service";
import { CreateBillDto } from "@/modules/user/dto/create-bill.dto";

@Controller("payment")
export class PaymentController {
  constructor(private paymentService: PaymentService) {}

  @Post("create_payment_url")
  async createPaymentUrl(
    @Req() req: any,
    @Body() createBillDto: CreateBillDto,
  ) {
    return this.paymentService.handlePayment({ createBillDto, req });
  }
}
