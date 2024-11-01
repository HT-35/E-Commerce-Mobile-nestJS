import { BadRequestException, Controller, Post, Req } from "@nestjs/common";

import * as querystring from "qs";
import * as crypto from "crypto";

import { paymentList } from "@/utils/paymentList";

@Controller("payment")
export class PaymentController {
  @Post("create_payment_url")
  async createPaymentUrl(@Req() req: any) {
    try {
      const ipAddr =
        req.headers["x-forwarded-for"] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress;

      const tmnCode = paymentList.vnp_TmnCode();
      const secretKey = paymentList.vnp_HashSecret();
      let vnpUrl = paymentList.vnp_Url;
      const returnUrl = paymentList.vnp_ReturnUrl;

      const date = new Date();

      const dateFormatModule = await import("dateformat");
      const dateFormat = dateFormatModule.default || dateFormatModule;
      const createDate = dateFormat(date, "yyyymmddHHmmss");
      const orderId = dateFormat(date, "HHmmss");

      const amount = req.body.amount;
      const bankCode = req.body.bankCode;

      const orderInfo = req.body.orderDescription; // nội dung chuyển khoản
      //const orderType = req.body.orderType;

      let locale = req.body.language;
      if (locale === null || locale === "") {
        locale = "vn";
      }
      const currCode = "VND";
      let vnp_Params = {};
      vnp_Params["vnp_Version"] = "2.1.0";
      vnp_Params["vnp_Command"] = "pay";
      vnp_Params["vnp_TmnCode"] = tmnCode;
      // vnp_Params['vnp_Merchant'] = ''
      vnp_Params["vnp_Locale"] = locale;
      vnp_Params["vnp_CurrCode"] = currCode;
      vnp_Params["vnp_TxnRef"] = orderId;
      vnp_Params["vnp_OrderInfo"] = orderInfo;
      //vnp_Params["vnp_OrderType"] = orderType;
      vnp_Params["vnp_OrderType"] = 110000;
      vnp_Params["vnp_Amount"] = amount * 100;
      vnp_Params["vnp_ReturnUrl"] = returnUrl;
      vnp_Params["vnp_IpAddr"] = ipAddr;
      vnp_Params["vnp_CreateDate"] = createDate;
      if (bankCode !== null && bankCode !== "") {
        vnp_Params["vnp_BankCode"] = bankCode;
      }

      vnp_Params = this.sortObject(vnp_Params);

      const signData = querystring.stringify(vnp_Params, { encode: false });
      const hmac = crypto.createHmac("sha512", secretKey);

      const signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");

      vnp_Params["vnp_SecureHash"] = signed;
      vnpUrl += "?" + querystring.stringify(vnp_Params, { encode: false });
      return { vnpUrl };
    } catch (error) {
      throw new BadRequestException();
    }
  }

  private sortObject(obj: any) {
    const sorted = {};
    const str = [];
    let key: any;
    for (key in obj) {
      if (obj.hasOwnProperty(key)) {
        str.push(encodeURIComponent(key));
      }
    }
    str.sort();
    for (key = 0; key < str.length; key++) {
      sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
    }
    return sorted;
  }
}
