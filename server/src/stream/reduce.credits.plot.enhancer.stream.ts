import { StreamConfig } from "motia";
import { z } from "zod";

const schema = z.object({
  creditsId: z.string(),
  credits: z.number(),
});

export const config: StreamConfig = {
  name: "reduceCreditsPlotEnhancerStream",
  baseConfig: { storageType: "default" },
  schema,
};
