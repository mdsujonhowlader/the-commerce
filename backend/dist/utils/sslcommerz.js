import SSLCommerzPayment from "sslcommerz-lts";
function checkEnv(name) {
    const extractValue = process.env[name];
    if (!extractValue) {
        throw new Error(`Missing env:${name}`);
    }
    return extractValue;
}
const store_id = checkEnv("SSL_STORE_ID");
const store_passwd = checkEnv("SSL_KEY_SECRET");
const is_live = false;
const sslz = new SSLCommerzPayment(store_id, store_passwd, is_live);
export async function initPayment(data) {
    const response = (await sslz.init(data));
    return response;
}
export async function validatePayment(val_id) {
    const response = await sslz.validate({ val_id });
    return response;
}
export async function transactionQueryByTransactionId(tran_id) {
    const response = await sslz.transactionQueryByTransactionId({ tran_id });
    return response;
}
