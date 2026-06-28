import { Router } from "express";
import { requireAuth } from "../../middleware/auth.js";
import {
  initOrder,
  orderSuccess,
  orderFail,
  orderCancel,
  orderIpn,
  getOrders,
  getOrderById,
} from "../../controller/customer/order.controller.js";

export const customerOrderRoute = Router();

customerOrderRoute.post("/order/init", requireAuth, initOrder);
customerOrderRoute.post("/order/success", orderSuccess);
customerOrderRoute.post("/order/fail", orderFail);
customerOrderRoute.post("/order/cancel", orderCancel);
customerOrderRoute.post("/order/ipn", orderIpn);
customerOrderRoute.get("/orders", requireAuth, getOrders);
customerOrderRoute.get("/order/:_id", requireAuth, getOrderById);
