import mongoose from "mongoose";
import env from "./env";

export const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) {
    console.log("Already connected to database");
    return mongoose.connection;
  }

  try {
    await mongoose.connect(env.MONGO_DB_URI);
    console.log("Connected to database");
    return mongoose.connection;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to connect to database");
  }
};
