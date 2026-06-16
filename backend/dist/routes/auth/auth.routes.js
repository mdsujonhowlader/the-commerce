import { Router } from "express";
import { requireAuth } from "../../middleware/auth.js";
import { getMe, syncUser } from "../../controller/auth/auth.controller.js";
export const authRouter = Router();
authRouter.post("/sync", requireAuth, syncUser);
authRouter.get("/me", requireAuth, getMe);
