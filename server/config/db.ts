import mongoose, { Connection } from "mongoose";
import env from "./env";

let db: Connection | null = null;

export const connectDB = async () => {
  try {
    if (!db) {
      await mongoose.connect(env.MONGO_DB_URI);
      db = mongoose.connection;
    }
    return db;
  } catch (error) {
    console.error(error);
    throw new Error(`Failed to connect to database: ${error}`);
  }
};
