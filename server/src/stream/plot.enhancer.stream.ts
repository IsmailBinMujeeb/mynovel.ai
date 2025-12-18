import { StreamConfig } from "motia";
import { z } from "zod";

const schema = z.object({
  novelId: z.string(),
  plot: z.string(),
});

export const config: StreamConfig = {
  name: "plotEenhancerStream",
  baseConfig: { storageType: "default" },
  schema,
};
