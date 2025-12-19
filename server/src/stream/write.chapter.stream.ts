import { StreamConfig } from "motia";
import { z } from "zod";

const schema = z.object({
  isCompleted: z.boolean(),
  content: z.string(),
});

export const config: StreamConfig = {
  name: "writeChapterStream",
  baseConfig: { storageType: "default" },
  schema,
};
