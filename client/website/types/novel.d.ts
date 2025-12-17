import { Chapter } from "./chapter.d";
import type { Context } from "./context";

export interface Novel {
  _id: string;
  title: string;
  userId: string;
  plot: string;
  coverPrompt: string | null;
  createdAt: Date;
  updatedAt: Date;
  chapters: Chapter[];
  form: Context;
}
