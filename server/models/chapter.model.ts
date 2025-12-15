import mongoose, { Document } from "mongoose";

export interface IChapter extends Document {
  title: string;
  novelId: mongoose.ObjectId;
  content: string;
  chapterPrompt: string;
  chapterNumber: number;
  isPrologue: boolean;
  isEpilogue: boolean;
  contentSummary: string;
}

const chapterSchema = new mongoose.Schema({
  title: { type: String, required: true },
  novelId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Novel",
    required: true,
  },
  content: { type: String, required: true },
  chapterPrompt: { type: String, required: true },
  chapterNumber: { type: Number, required: true },
  isPrologue: { type: Boolean, default: false },
  isEpilogue: { type: Boolean, default: false },
  contentSummary: { type: String, required: true },
});

export const Chapter = mongoose.model<IChapter>("Chapter", chapterSchema);
