import mongoose from "mongoose";

export async function connectDB() {
  const uri = process.env.MONGO_URI;

  if (!uri) {
    throw new Error("MONGO_URI is not defined in environment variables");
  }

  try {
    await mongoose.connect(uri);
    console.log("DB Connected Successfully");
  } catch (error) {
    console.error("DB Connection Failed:", error);
    process.exit(1);
  }
}