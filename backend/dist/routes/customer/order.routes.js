import { Router } from "express";
import { checkoutSession, orderCancel, orderFail, orderIpn, orderSuccess, } from "../../controller/customer/checkout.controller.js";
import { requireAuth } from "../../middleware/auth.js";
export const customerOrderRoute = Router();
customerOrderRoute.post("/order/init", requireAuth, checkoutSession);
customerOrderRoute.post("/order/success", orderSuccess);
customerOrderRoute.post("/order/fail", orderFail);
customerOrderRoute.post("/order/cancel", orderCancel);
customerOrderRoute.post("/order/ipn", orderIpn);
