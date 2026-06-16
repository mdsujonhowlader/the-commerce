import { getAuth } from "@clerk/express";
import { AppError } from "../utils/AppError.js";
import { User } from "../models/User.js";
import { asyncHandler } from "../utils/asyncHandler.js";
export function requireAuth(req, _res, next) {
    const { userId } = getAuth(req);
    if (!userId) {
        return next(new AppError(401, "Unauthorized to access"));
    }
    next();
}
export async function getDbUserFromReq(req) {
    const { userId } = getAuth(req);
    if (!userId) {
        new AppError(401, "Unauthorized to access");
    }
    const dbUser = await User.findOne({ clerkUserId: userId });
    if (!dbUser) {
        throw new AppError(404, "user is not find on DB");
    }
    return dbUser;
}
export const requiredAdmin = asyncHandler(async (req, _res, next) => {
    const extractCurrentDbUser = await getDbUserFromReq(req);
    if (extractCurrentDbUser.role !== "admin") {
        throw new AppError(403, "Admin Access only");
    }
    next();
});
