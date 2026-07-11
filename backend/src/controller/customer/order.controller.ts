import type { Request, Response } from "express";
import { Types } from "mongoose";
import { getDbUserFromReq } from "../../middleware/auth.js";
import { Order, OrderStatus, PaymentStatus } from "../../models/Order.js";
import { Product } from "../../models/Product.js";
import { User } from "../../models/User.js";
import { AppError } from "../../utils/AppError.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { successResponse } from "../../utils/envelope.js";
import { requireFound, requireText } from "../../utils/helper.js";

type CustomerOrderRow = {
  _id: Types.ObjectId;
  totalItems: number;
  totalAmmount: number;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  paidAt: Date | null;
  deliveryAt: Date | null;
  returnAt: Date | null;
  createdAt: Date;
};

export const getCustomerOrder = asyncHandler(
  async (req: Request, res: Response) => {
    const dbUser = await getDbUserFromReq(req);

    const orders = await Order.find({ user: dbUser._id })
      .select(
        "totalItems totalAmmount paymentStatus orderStatus paidAt deliveryAt returnAt createdAt",
      )
      .sort({ createdAt: -1 })
      .lean<CustomerOrderRow[]>();

    res.json(
      successResponse({
        items: orders.map((orderItem) => ({
          _id: String(orderItem._id),
          code: String(orderItem._id).slice(-8).toUpperCase(),
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

export const patchCustomerOrderReturn = asyncHandler(
  async (req: Request, res: Response) => {
    const dbUser = await getDbUserFromReq(req);
    const orderId = String(req.params.orderId || "").trim();

    requireText(orderId, "Order id is required");
    const order = await Order.findOne({ _id: orderId, user: dbUser._id });

    const foundOrder = requireFound(order, "Order is not found", 404);

    if (foundOrder.orderStatus !== "delivered" || !foundOrder.deliveryAt) {
      throw new AppError(400, "Only delivered orders can be returned");
    }
    const sevenDaysRequiredToReturned = 7 * 24 * 60 * 60 * 1000;

    if (
      Date.now() - new Date(foundOrder.deliveryAt).getTime() >
      sevenDaysRequiredToReturned
    ) {
      throw new AppError(400, "Return window expired");
    }
    for (const item of foundOrder.items) {
      await Product.updateOne(
        {
          _id: item.products,
        },
        {
          $inc: { stock: item.quantity },
        },
      );
    }
    await User.updateOne(
      { _id: dbUser._id },
      {
        $inc: { points: foundOrder.totalAmmount },
      },
    );
    foundOrder.orderStatus = "returned";
    foundOrder.returnAt = new Date();
    await foundOrder.save();
    res.json(
      successResponse({
        _id: String(foundOrder._id),
        orderStatus: foundOrder.orderStatus,
        returnAt: foundOrder.returnAt,
      }),
    );
  },
);
