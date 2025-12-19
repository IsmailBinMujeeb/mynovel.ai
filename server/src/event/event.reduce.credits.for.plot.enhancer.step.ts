import { Handlers, EventConfig, FlowContext, Emit } from "@motiadev/core";
import { connectDB } from "../../config/db";
import { Credit } from "../../models/credit.model";

export const config: EventConfig = {
  type: "event",
  name: "event.reduce.credits.plot.enhancer",
  description: "Reduces credits for plot enhancement step",
  emits: [],
  subscribes: ["reduce.credits.plot.enhancer"],
  flows: ["flow.plot.enhancer"],
};

// @ts-ignore
export const handler: Handlers["event.reduce.credits.plot.enhancer"] = async (
  input: any,
  ctx: FlowContext<Emit>,
) => {
  const { userId } = input;

  await connectDB();

  const credits = await Credit.findOne({ userId });

  if (!credits) {
    throw new Error("Credits not found");
  }

  if (credits.dailyCredits >= 8) {
    credits.dailyCredits -= 8;
    await credits.save();
  } else if (credits.boughtCredits >= 8) {
    credits.boughtCredits -= 8;
    await credits.save();
  } else {
    throw new Error("Insufficient credits");
  }

  await ctx.streams.reduceCreditsPlotEnhancerStream.set(
    "gid.reduce.credits.plot.enhancer.stream",
    credits._id.toString(),
    {
      creditsId: credits._id.toString(),
      credits: credits.dailyCredits + credits.boughtCredits - 8,
    },
  );
};
