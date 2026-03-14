import crypto from 'crypto';

/**
 * VNPay Helper Utilities
 */

export const createPaymentUrl = ({
  amount,
  orderId,
  orderInfo,
  ipAddr,
}: {
  amount: number;
  orderId: string;
  orderInfo: string;
  ipAddr: string;
}) => {
  // Use env variables with hardcoded fallbacks for the Sandbox environment
  // to prevent stale environment issues in development.
  const tmnCode = process.env.VNP_TMNCODE || 'CG978S6C';
  const secretKey = process.env.VNP_HASHSECRET || 'A5804566133045278D0B3492728BC62C';
  const vnpUrl = process.env.VNP_URL || 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html';
  const returnUrl = process.env.VNP_RETURN_URL || 'http://localhost:3000/api/payment/vnpay/return';

  const date = new Date();
  const createDate = 
    date.getFullYear().toString() +
    (date.getMonth() + 1).toString().padStart(2, '0') +
    date.getDate().toString().padStart(2, '0') +
    date.getHours().toString().padStart(2, '0') +
    date.getMinutes().toString().padStart(2, '0') +
    date.getSeconds().toString().padStart(2, '0');

  let vnp_Params: any = {};
  vnp_Params['vnp_Version'] = '2.1.0';
  vnp_Params['vnp_Command'] = 'pay';
  vnp_Params['vnp_TmnCode'] = tmnCode;
  vnp_Params['vnp_Locale'] = 'vn';
  vnp_Params['vnp_CurrCode'] = 'VND';
  vnp_Params['vnp_TxnRef'] = orderId;
  vnp_Params['vnp_OrderInfo'] = orderInfo;
  vnp_Params['vnp_OrderType'] = 'other';
  vnp_Params['vnp_Amount'] = Math.round(amount * 100);
  vnp_Params['vnp_ReturnUrl'] = returnUrl;
  vnp_Params['vnp_IpAddr'] = ipAddr;
  vnp_Params['vnp_CreateDate'] = createDate;

  vnp_Params = sortObject(vnp_Params);
  
  // Construct signData manually from sorted params to avoid double-encoding
  const signData = Object.keys(vnp_Params)
    .map(key => `${key}=${vnp_Params[key]}`)
    .join('&');

  const hmac = crypto.createHmac('sha512', secretKey);
  const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');
  
  vnp_Params['vnp_SecureHash'] = signed;
  
  // Final URL construction - use URLSearchParams for the final redirect
  const searchParams = new URLSearchParams();
  for (const key in vnp_Params) {
    // Decode first because URLSearchParams will re-encode
    searchParams.set(key, decodeURIComponent(vnp_Params[key]));
  }

  return vnpUrl + '?' + searchParams.toString();
};

export const verifyReturnUrl = (vnp_Params: any) => {
  const secretKey = process.env.VNP_HASHSECRET;
  if (!secretKey) throw new Error('Missing VNP_HASHSECRET');

  const secureHash = vnp_Params['vnp_SecureHash'];

  delete vnp_Params['vnp_SecureHash'];
  delete vnp_Params['vnp_SecureHashType'];

  const sortedParams = sortObject(vnp_Params);
  const signData = Object.keys(sortedParams)
    .map(key => `${key}=${sortedParams[key]}`)
    .join('&');
  
  const hmac = crypto.createHmac('sha512', secretKey);
  const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');

  return secureHash === signed;
};

function sortObject(obj: any) {
  const sorted: any = {};
  const str = [];
  let key;
  for (key in obj) {
    if (obj.hasOwnProperty(key)) {
      str.push(encodeURIComponent(key));
    }
  }
  str.sort();
  for (key = 0; key < str.length; key++) {
    sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, '+');
  }
  return sorted;
}
