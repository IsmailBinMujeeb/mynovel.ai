import mongoose, { Document } from "mongoose";

export interface IUser extends Document {
  email: string;
  password: string;
  username: string;
  avatar: string;
  refreshToken: string;
}

const userSchema = new mongoose.Schema<IUser>(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    avatar: { type: String, required: true },
    refreshToken: { type: String, default: "" },
  },
  { timestamps: true },
);

export default mongoose.model<IUser>("User", userSchema);
