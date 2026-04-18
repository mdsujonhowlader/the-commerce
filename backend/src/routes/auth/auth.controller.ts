import { clerkClient, getAuth } from "@clerk/express";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { successResponse } from "../../utils/envelope.js";
import { AppError } from "../../utils/AppError.js";
import { User } from "../../models/User.js";

export const syncUser = asyncHandler(async (req, res) => {
  const { userId } = getAuth(req);
  if (!userId) {
    throw new AppError(401, "Unauthorized to access");
  }
  const clerkUser = await clerkClient.users.getUser(userId);

  const extractEmailFromUserInfo =
    clerkUser.emailAddresses.find(
      (item) => item.id === clerkUser.primaryEmailAddressId,
    ) || clerkUser.emailAddresses[0];
  const email = extractEmailFromUserInfo.emailAddress;

  const fullName = [clerkUser.firstName, clerkUser.lastName]
    .filter(Boolean)
    .join(" ")
    .trim();

  const name = fullName || clerkUser.username;

  const raw = process.env.ADMIN_EMAILS || "";

  const adminEmails = new Set(
    raw
      .split(",")
      .map((item) => item.trim().toLowerCase())
      .filter(Boolean),
  );

  const existingUser = await User.findOne({ clerkUserId: userId });
  const shouldbeAdmin = email ? adminEmails.has(email.toLowerCase()) : false;

  const nextRole =
    existingUser?.role === "admin"
      ? "admin"
      : shouldbeAdmin
        ? "admin"
        : existingUser?.role || "user";

  const newlyCreatedUser = await User.findOneAndUpdate(
    {
      clerkUserId: userId,
    },
    {
      clerkUserId: userId,
      email,
      name,
      role: nextRole,
    },
    {
      returnDocument: 'after',
      upsert: true,
      setDefaultsOnInsert: true,
    },
  );
  res.status(200).json(
    successResponse({
      user: {
        id: newlyCreatedUser._id,
        clerkUserId: newlyCreatedUser.clerkUserId,
        email: newlyCreatedUser.email,
        name: newlyCreatedUser.name,
        role: newlyCreatedUser.role,
      },
    }),
  );
});

export const getMe = asyncHandler(async (req, res) => {
  const { userId } = getAuth(req);
  if (!userId) {
    throw new AppError(401, "Unauthorized to access");
  }
  const dbUser = await User.findOne({ clerkUserId: userId });
  if (!dbUser) {
    throw new AppError(404, "User is not Found on DB");
  }
  res.status(200).json(
    successResponse({
      user: {
        id: dbUser._id,
        clerkUserId: dbUser.clerkUserId,
        email: dbUser.email,
        name: dbUser.name,
        role: dbUser.role,
      },
    }),
  );
});
