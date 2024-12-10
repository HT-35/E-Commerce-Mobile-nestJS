export const paymentList = {
  vnp_TmnCode: () => process.env.vnp_TmnCode,
  vnp_HashSecret: () => process.env.vnp_HashSecret,
  vnp_Url: "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html",
  vnp_Api: "https://sandbox.vnpayment.vn/merchant_webapi/api/transaction",
  //vnp_ReturnUrl: "http://localhost:3232/order/vnpay_return",
  //vnp_ReturnUrl: "http://localhost:3000/bill/", //localhost
  vnp_ReturnUrl: "http://14.225.254.209:3000/bill/", //cloud
};
