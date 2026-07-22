import { Router } from "express";

import multer from "multer";
import {
  getAllBanner,
  uploadManyBanner,
} from "../../controller/admin/settings.controller.js";
import { requiredAdmin } from "../../middleware/auth.js";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024,
    files: 10,
  },
});

export const adminSettingsRoute = Router();

adminSettingsRoute.get("/settings/banners", requiredAdmin, getAllBanner);
adminSettingsRoute.post(
  "/settings/banners",
  requiredAdmin,
  upload.array("images", 10),
  uploadManyBanner,
);
