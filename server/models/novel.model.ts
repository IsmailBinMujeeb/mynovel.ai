import mongoose, { Document } from "mongoose";

export interface INovel extends Document {
  title: string;
  userId: mongoose.ObjectId;
  plot: string;
  coverPrompt: string;
}

const novelSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    plot: { type: String, required: true },
    coverPrompt: { type: String, required: true },
  },
  { timestamps: true },
);

export const Novel = mongoose.model<INovel>("Novel", novelSchema);
