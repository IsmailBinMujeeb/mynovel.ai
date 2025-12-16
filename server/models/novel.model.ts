import mongoose, { Document, Query } from "mongoose";
import { Chapter } from "./chapter.model";
import { Form } from "./form.model";

export interface INovel extends Document {
  title: string;
  userId: mongoose.ObjectId;
  plot: string;
  coverPrompt: string | null;
}

const novelSchema = new mongoose.Schema<INovel>(
  {
    title: { type: String, required: true },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    plot: { type: String, required: true },
    coverPrompt: { type: String, default: null },
  },
  { timestamps: true },
);

novelSchema.pre("findOneAndDelete", async function (this: Query<any, INovel>) {
  const novel = await this.model.findOne(this.getFilter());

  if (!novel) return;

  await Promise.all([
    Chapter.deleteMany({ novelId: novel._id }),
    Form.deleteMany({ novelId: novel._id }),
  ]);
});

export const Novel = mongoose.model<INovel>("Novel", novelSchema);
