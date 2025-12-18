import mongoose, { Document } from "mongoose";

export interface IFormField {
  label: string;
  answer: string | null;
  level: number;
  isAnswered: boolean;
}

export interface IForm extends Document {
  novelId: mongoose.Schema.Types.ObjectId;
  fields: IFormField[];
  userId: mongoose.Schema.Types.ObjectId;
  isAllQuestionsAnswered: boolean;
  summary: string | null;
}

export const FormSchema = new mongoose.Schema<IForm>(
  {
    novelId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Novel",
      required: true,
      unique: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    fields: [
      {
        label: { type: String, required: true },
        answer: { type: String, default: null },
        level: { type: Number, required: true },
        isAnswered: { type: Boolean, default: false },
      },
    ],
    isAllQuestionsAnswered: { type: Boolean, default: false },
    summary: { type: String, default: null },
  },
  { timestamps: true },
);

export const Form = mongoose.model<IForm>("Form", FormSchema);
