import { Controller, Post, Req } from "@nestjs/common";

import { PaymentService } from "@/modules/payment/payment.service";

@Controller("payment")
export class PaymentController {
  constructor(private paymentService: PaymentService) {}

  @Post("create_payment_url")
  async createPaymentUrl(@Req() req: any) {
    return this.paymentService.handlePayment(req);
  }
}
