export const paymentList = {
  vnp_TmnCode: () => process.env.vnp_TmnCode,
  vnp_HashSecret: () => process.env.vnp_HashSecret,
  vnp_Url: "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html",
  vnp_Api: "https://sandbox.vnpayment.vn/merchant_webapi/api/transaction",
  vnp_ReturnUrl: "http://localhost:3232/order/vnpay_return",
};