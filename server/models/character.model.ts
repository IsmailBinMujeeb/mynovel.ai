import mongoose, { Document } from "mongoose";

export interface ICharacter extends Document {
  novelId: mongoose.Types.ObjectId;
  name: string;
  personality: string;
  role: string;
  age: number;
}

const characterSchema = new mongoose.Schema<ICharacter>(
  {
    novelId: { type: mongoose.Types.ObjectId, ref: "Novel", required: true },
    name: { type: String, required: true },
    personality: { type: String, required: true },
    role: { type: String, required: true },
    age: { type: Number, required: true },
  },
  { timestamps: true },
);

export const Character = mongoose.model<ICharacter>(
  "Character",
  characterSchema,
);
