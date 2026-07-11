import { Router } from "express";
import {
  checkoutSession,
  orderCancel,
  orderFail,
  orderIpn,
  orderSuccess,
} from "../../controller/customer/checkout.controller.js";
import {
  checkoutPoints,
  checkoutSessionForPoints,
} from "../../controller/customer/checkoutWithPoints.controller.js";
import {
  getCustomerOrder,
  patchCustomerOrderReturn,
} from "../../controller/customer/order.controller.js";
import { requireAuth } from "../../middleware/auth.js";

export const customerOrderRoute = Router();

customerOrderRoute.post("/order/init", requireAuth, checkoutSession);
customerOrderRoute.post("/order/success", orderSuccess);
customerOrderRoute.post("/order/fail", orderFail);
customerOrderRoute.post("/order/cancel", orderCancel);
customerOrderRoute.post("/order/ipn", orderIpn);

//order

customerOrderRoute.get("/orders", requireAuth, getCustomerOrder);
customerOrderRoute.patch(
  "/orders/:orderId/return",
  requireAuth,
  patchCustomerOrderReturn,
);

//points
customerOrderRoute.get("checkout/points", requireAuth, checkoutPoints);
customerOrderRoute.post(
  "checkout/pay-with-points",
  requireAuth,
  checkoutSessionForPoints,
);
