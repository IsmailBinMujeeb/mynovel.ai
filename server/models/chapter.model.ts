import mongoose, { Document } from "mongoose";

export interface IChapter extends Document {
  title: string;
  novelId: mongoose.Schema.Types.ObjectId;
  userId: mongoose.Schema.Types.ObjectId;
  content: string;
  chapterPrompt: string;
  chapterNumber: number;
  isPrologue: boolean;
  isEpilogue: boolean;
  wordCount: number;
  readTime: number; // in minutes
  contentSummary: string;
}

const chapterSchema = new mongoose.Schema<IChapter>(
  {
    title: { type: String, required: true },
    novelId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Novel",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: { type: String, required: true },
    chapterPrompt: { type: String, required: true },
    chapterNumber: { type: Number, required: true },
    isPrologue: { type: Boolean, default: false },
    isEpilogue: { type: Boolean, default: false },
    wordCount: { type: Number, required: true },
    readTime: { type: Number, required: true },
    contentSummary: { type: String, required: true },
  },
  { timestamps: true },
);

export const Chapter = mongoose.model<IChapter>("Chapter", chapterSchema);
