import { CronConfig, Handlers } from "motia";
import { connectDB } from "../../config/db";
import { Credit } from "../../models/credit.model";

export const config: CronConfig = {
  type: "cron",
  name: "cron.daily.credits",
  description: "Daily credits",
  cron: "0 0 * * *",
  emits: [],
  flows: [],
};

// @ts-ignore
export const handler: Handlers["cron.daily.credits"] = async (req, ctx) => {
  await connectDB();
  await Credit.updateMany({}, { $set: { dailyCredits: 20 } });
};
