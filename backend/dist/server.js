import { clerkMiddleware } from "@clerk/express";
import cors from "cors";
import "dotenv/config";
import express from "express";
import morgan from "morgan";
import { connectDB } from "./db.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { notFound } from "./middleware/notFound.js";
import { adminBrandRoute } from "./routes/admin/brand.routes.js";
import { adminCateRoute } from "./routes/admin/category.routes.js";
import { adminDashboardRoute } from "./routes/admin/dashboard.routes.js";
import { adminOrderRoute } from "./routes/admin/order.routes.js";
import { adminProRoute } from "./routes/admin/product.routes.js";
import { adminPromoRoute } from "./routes/admin/promo.routes.js";
import { adminSettingsRoute } from "./routes/admin/settings.routes.js";
import { authRouter } from "./routes/auth/auth.routes.js";
import { customerAddressRoute } from "./routes/customer/address.routes.js";
import { customerBrandRoute } from "./routes/customer/brand.routes.js";
import { customerCategoryRoute } from "./routes/customer/category.routes.js";
import { customerHomeRoute } from "./routes/customer/home.routes.js";
import { customerOrderRoute } from "./routes/customer/order.routes.js";
import { customerProductRoute } from "./routes/customer/product.routes.js";
import { customerPromoRoute } from "./routes/customer/promo.routes.js";
import { successResponse } from "./utils/envelope.js";
async function mainEntryFunction() {
    await connectDB();
    const app = express();
    const corsOrigin = (process.env.CORS_ORIGINS || "http://localhost:5173")
        .split(",")
        .map((origin) => origin.trim())
        .filter(Boolean);
    app.use(cors({
        origin: corsOrigin,
        credentials: true,
    }));
    app.use(express.json());
    app.use(morgan("dev"));
    app.get("/health", (_req, res) => {
        res
            .status(200)
            .json(successResponse({ message: "Server is healthy/ in running" }));
    });
    app.use(clerkMiddleware());
    app.use("/auth", authRouter);
    //customer
    app.use("/customer", customerProductRoute);
    app.use("/customer", customerCategoryRoute);
    app.use("/customer", customerBrandRoute);
    app.use("/customer", customerAddressRoute);
    app.use("/customer", customerPromoRoute);
    app.use("/customer", customerOrderRoute);
    app.use("/customer", customerHomeRoute);
    //admin
    app.use("/admin", adminCateRoute);
    app.use("/admin", adminBrandRoute);
    app.use("/admin", adminProRoute);
    app.use("/admin", adminPromoRoute);
    app.use("/admin", adminOrderRoute);
    app.use("/admin", adminSettingsRoute);
    app.use("/admin", adminDashboardRoute);
    //not found and global error handle
    app.use(notFound);
    app.use(errorHandler);
    const port = Number(process.env.PORT || 5000);
    app.listen(port, () => {
        console.log(`Server is Running on Port ${port}`);
    });
}
mainEntryFunction().catch((err) => {
    console.error("Failed to start", err);
    process.exit(1);
});
