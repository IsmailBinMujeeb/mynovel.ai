import { StreamConfig } from "motia";
import { z } from "zod";

const schema = z.object({
  chapterId: z.string(),
  prompt: z.string(),
  title: z.string(),
  content: z.string(),
});

export const config: StreamConfig = {
  name: "writeChapterStream",
  baseConfig: { storageType: "default" },
  schema,
};
