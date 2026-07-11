import { type Request, type Response } from "express";
import { Types } from "mongoose";
import { Order, OrderStatus, PaymentStatus } from "../../models/Order.js";
import { Product } from "../../models/Product.js";
import { AppError } from "../../utils/AppError.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { successResponse } from "../../utils/envelope.js";
import { requireFound, requireText } from "../../utils/helper.js";

const ALLOWED_ORDER_STATUSES = [
  "placed",
  "shipped",
  "delivered",
  "returned",
] as const;
type AdminOrderStatus = (typeof ALLOWED_ORDER_STATUSES)[number];

type AdminOrderRow = {
  _id: Types.ObjectId;
  customerName: string;
  customerEmail: string;
  totalItems: number;
  totalAmmount: number;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  paidAt?: Date | null;
  deliveryAt?: Date | null;
  returnAt?: Date | null;
  createdAt: Date;
};
export const getAdminOrder = asyncHandler(
  async (req: Request, res: Response) => {
    const orders = await Order.find()
      .select(
        "totalItems totalAmmount paymentStatus orderStatus paidAt deliveryAt returnAt createdAt",
      )
      .sort({ createdAt: -1 })
      .lean<AdminOrderRow[]>();

    res.json(
      successResponse({
        items: orders.map((orderItem) => ({
          _id: String(orderItem._id),
          code: String(orderItem._id).slice(-8).toUpperCase(),
          customerName: orderItem.customerName,
          customerEmail: orderItem.customerEmail,
          totalItems: orderItem.totalItems,
          totalAmmount: orderItem.totalAmmount,
          paymentStatus: orderItem.paymentStatus,
          orderStatus: orderItem.orderStatus,
          paidAt: orderItem.paidAt,
          deliveryAt: orderItem.deliveryAt,
          returnAt: orderItem.returnAt,
          createdAt: orderItem.createdAt,
        })),
      }),
    );
  },
);

export const patchAdminOrderStatus = asyncHandler(
  async (req: Request, res: Response) => {
    const orderId = String(req.params.orderId || "").trim();
    const orderStatus = String(
      req.body.orderStatus || "",
    ).trim() as AdminOrderStatus;

    requireText(orderId, "Order id is required");
    requireText(orderStatus, "order status is required");
    if (!ALLOWED_ORDER_STATUSES.includes(orderStatus)) {
      throw new AppError(400, "Invalid order status");
    }
    const order = await Order.findById(orderId);
    const foundOrder = requireFound(order, "Order not found", 404);
    if (orderStatus === "returned" && foundOrder.orderStatus !== "returned") {
      for (const item of foundOrder.items) {
        await Product.updateOne(
          {
            _id: item.products,
          },
          {
            $stock: { stock: item.quantity },
          },
        );
      }
    }
    if (orderStatus === "delivered" && !foundOrder.deliveryAt) {
      foundOrder.deliveryAt = new Date();
    }
    foundOrder.orderStatus = orderStatus;
    await foundOrder.save();

    res.json(
      successResponse({
        _id: String(foundOrder._id),
        orderStatus: foundOrder.orderStatus,
        deliveryAt: foundOrder.deliveryAt,
        returnAt: foundOrder.returnAt,
      }),
    );
  },
);
