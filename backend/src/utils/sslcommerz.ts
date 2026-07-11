import SSLCommerzPayment from "sslcommerz-lts";

function checkEnv(name: string): string {
  const extractValue = process.env[name];
  if (!extractValue) {
    throw new Error(`Missing env:${name}`);
  }
  return extractValue;
}

const store_id = checkEnv("SSL_STORE_ID");
const store_passwd = checkEnv("SSL_KEY_SECRET");
const is_live = false;
export type initialPaymentData = {
  total_amount: number;
  currency: "BDT";
  tran_id: string; // use unique tran_id for each api call
  success_url: string;
  fail_url: string;
  cancel_url: string;
  ipn_url: string;
  shipping_method: string;
  product_name: string;
  product_category: string;
  product_profile: string;
  cus_name: string;
  cus_email: string;
  cus_add1: string;
  cus_add2: string;
  cus_city: string;
  cus_state: string;
  cus_postcode: string;
  cus_country: string;
  cus_phone: string;
  cus_fax: string;
  ship_name: string;
  ship_add1: string;
  ship_add2: string;
  ship_city: string;
  ship_state: string;
  ship_postcode: number;
  ship_country: string;
};

type SSLResponse = {
  GatewayPageURL: string;
  sessionkey: string;
};

const sslz = new SSLCommerzPayment(store_id, store_passwd, is_live);

export async function initPayment(
  data: initialPaymentData,
): Promise<SSLResponse> {
  const response = (await sslz.init(data)) as SSLResponse;
  return response;
}

export async function validatePayment(val_id: string) {
  const response = await sslz.validate({ val_id });
  return response as Record<string, unknown>;
}

export async function transactionQueryByTransactionId(tran_id: string) {
  const response = await sslz.transactionQueryByTransactionId({ tran_id });
  return response as Record<string, unknown>;
}
