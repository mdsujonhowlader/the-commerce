import { type Request, type Response } from "express";
import { Brand } from "../../models/Brand.js";
import { Category } from "../../models/Category.js";
import { Order } from "../../models/Order.js";
import { Product } from "../../models/Product.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { successResponse } from "../../utils/envelope.js";

type TotalSaleRow = {
  _id: null;
  totalSales: number;
};

export const dashboardReport = asyncHandler(
  async (_req: Request, res: Response) => {
    const [
      totalProducts,
      totalBrands,
      totalCategory,
      totalOrders,
      totalReturnedOrder,
      salesRow,
    ] = await Promise.all([
      Product.countDocuments(),
      Brand.countDocuments(),
      Category.countDocuments(),
      Order.countDocuments(),
      Order.countDocuments({ orderStatus: "returned" }),
      Order.aggregate<TotalSaleRow>([
        { $match: { paymentStatus: "paid" } },
        { $group: { _id: null, totalSales: { $sum: "$totalAmmount" } } },
      ]),
    ]);
    res.json(
      successResponse({
        totalProducts,
        totalBrands,
        totalCategory,
        totalSales: salesRow[0]?.totalSales || 0,
        totalOrders,
        totalReturnedOrder,
      }),
    );
  },
);
