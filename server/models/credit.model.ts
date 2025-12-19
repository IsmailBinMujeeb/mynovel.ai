import mongoose, { Document } from "mongoose";

export interface ICredit extends Document {
  userId: mongoose.Types.ObjectId;
  dailyCredits: number;
  boughtCredits: number;
}

const CreditSchema = new mongoose.Schema<ICredit>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    dailyCredits: {
      type: Number,
      default: 20,
    },
    boughtCredits: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

export const Credit = mongoose.model<ICredit>("Credit", CreditSchema);
