import { BadRequestException, Injectable } from "@nestjs/common";

import * as querystring from "qs";
import * as crypto from "crypto";

import { paymentList } from "@/utils/paymentList";
import { UserService } from "@/modules/user/user.service";
import { ProductModelService } from "@/modules/product/product.service";
//import dateFormat from "dateformat";
import dateFormat from "dateformat";
@Injectable()
export class PaymentService {
  constructor(
    private userService: UserService,
    private productModelService: ProductModelService,
  ) {}

  async handlePayment(req: any) {
    try {
      const data = req.user;

      const { _id } = data;

      const productList = req.body.product;
      console.log(`productList:`, productList);

      const cart = await this.userService.getAllProductInCart(_id);

      const newCart = cart
        .map((itemCart: any) => {
          // Tìm item tương ứng trong items dựa trên slug và color
          const matchedItem = productList.find(
            (item) =>
              item.slug === itemCart?.slug?.slug &&
              item.color === itemCart?.color,
          );

          if (matchedItem) {
            const optionIndex = itemCart?.slug?.option?.findIndex(
              (itemOption: any) => itemOption.color === matchedItem.color,
            );
            // Kiểm tra optionIndex hợp lệ trước khi truy cập các giá trị bên trong
            const option =
              optionIndex !== -1 ? itemCart.slug.option[optionIndex] : {};
            //console.log(`itemCart:`, itemCart);
            return {
              color: itemCart?.color,
              slug: itemCart?.slug?.slug,
              name: itemCart?.slug?.name,
              price: option?.price || 0,
              quantity: itemCart?.quantity,
            };
          }
          return null; // Nếu không tìm thấy item khớp
        })
        .filter(Boolean); // Lọc các phần tử null ra khỏi mảng

      const amount = newCart.reduce((total, item) => {
        return +total + +item.price * +item.quantity;
      }, 0);

      const orderDescription = newCart
        .map(
          (item: any) =>
            `-slug:${item.slug}+color:${item.color}+quantity:${item.quantity}`,
        )
        .join("-");

      console.log(orderDescription);

      //return orderDescription;

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

      //const dateFormatModule = await import("dateformat");
      //const dateFormat = dateFormatModule.default || dateFormatModule;

      const createDate = dateFormat(date, "yyyymmddHHmmss");
      const orderId = dateFormat(date, "HHmmss");

      const bankCode = "";

      const orderInfo = orderDescription;

      let locale = "vn";
      if (locale === null || locale === "") {
        locale = "vn";
      }
      const currCode = "VND";
      let vnp_Params = {};
      vnp_Params["vnp_Version"] = "2.1.0";
      vnp_Params["vnp_Command"] = "pay";
      vnp_Params["vnp_TmnCode"] = tmnCode;

      vnp_Params["vnp_Locale"] = locale;
      vnp_Params["vnp_CurrCode"] = currCode;
      vnp_Params["vnp_TxnRef"] = orderId;
      vnp_Params["vnp_OrderInfo"] = orderInfo;

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
      console.log("");
      console.log("");
      console.log("error   ", error);
      console.log("");
      console.log("");
      console.log("");
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
