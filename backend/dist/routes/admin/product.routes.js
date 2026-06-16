import { Router } from "express";
import { requiredAdmin } from "../../middleware/auth.js";
import { createProducts, getProducts, updateProducts } from "../../controller/admin/product.controller.js";
import multer from "multer";
export const adminProRoute = Router();
const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fieldSize: 5 * 1024 * 1024,
        files: 10,
    },
});
adminProRoute.get("/products", requiredAdmin, getProducts);
adminProRoute.post("/product", requiredAdmin, upload.array("images", 10), createProducts);
adminProRoute.put('/product/:id', upload.array("images", 10), requiredAdmin, updateProducts);
// adminProRoute.delete('/product/:id',requiredAdmin,createCategory)
