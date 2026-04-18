import "dotenv/config";
import express from "express";
import { connectDB } from "./db.js";
import cors from "cors";
import morgan from "morgan";
import { notFound } from "./middleware/notFound.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { successResponse } from "./utils/envelope.js";
import { clerkMiddleware } from "@clerk/express";
import { authRouter } from "./routes/auth/auth.routes.js";

async function mainEntryFunction() {
  await connectDB();
  const app = express();
  const corsOrigin = (process.env.CORS_ORIGINS || "http://localhost:5173")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

  app.use(
    cors({
      origin: corsOrigin,
      credentials: true,
    }),
  );
  app.use(morgan("dev"));

  app.use((clerkMiddleware))

  app.get("/health", (_req, res) => {
    res
      .status(200)
      .json(successResponse({ message: "Server is healthy/ in running" }));
  });

  app.use("/auth",authRouter)
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
