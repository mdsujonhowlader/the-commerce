import { Router } from "express";
import { customerHomePageApi } from "../../controller/customer/home.controller.js";

export const customerHomeRoute = Router();

customerHomeRoute.get("/home", customerHomePageApi);
