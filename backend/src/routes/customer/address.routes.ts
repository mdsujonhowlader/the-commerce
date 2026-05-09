import { Router } from "express";
import {
  addCustomerAddress,
  deleteAddressById,
  getCustomerAddress,
  updateCustomerAddressById,
} from "../../controller/customer/address.controller.js";

export const customerAddressRoute = Router();

customerAddressRoute.get("/addresses", getCustomerAddress);
customerAddressRoute.post("/addresses", addCustomerAddress);
customerAddressRoute.patch("/addresses/:id", updateCustomerAddressById);
customerAddressRoute.get("/addresses/:id", deleteAddressById);
