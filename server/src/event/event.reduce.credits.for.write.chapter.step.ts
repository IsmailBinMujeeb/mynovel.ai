import { Handlers, EventConfig, FlowContext, Emit } from "@motiadev/core";
import { connectDB } from "../../config/db";
import { Credit } from "../../models/credit.model";

export const config: EventConfig = {
  type: "event",
  name: "event.reduce.credits.write.chapter",
  description: "Reduces credits for plot enhancement step",
  emits: [],
  subscribes: ["reduce.credits.write.chapter"],
  flows: ["flow.write.chapter"],
};

// @ts-ignore
export const handler: Handlers["event.reduce.credits.write.chapter"] = async (
  input: any,
  ctx: FlowContext<Emit>,
) => {
  const { userId } = input;

  ctx.logger.info(`Reducing credits for user ${userId}`);

  await connectDB();

  const credits = await Credit.findOne({ userId });

  if (!credits) {
    throw new Error("Credits not found");
  }

  if (credits.dailyCredits >= 20) {
    credits.dailyCredits -= 20;
    await credits.save();
  } else if (credits.boughtCredits >= 20) {
    credits.boughtCredits -= 20;
    await credits.save();
  } else {
    throw new Error("Insufficient credits");
  }

  await ctx.streams.reduceCreditsPlotEnhancerStream.set(
    "gid.reduce.credits.plot.enhancer.stream",
    credits._id.toString(),
    {
      creditsId: credits._id.toString(),
      credits: credits.dailyCredits + credits.boughtCredits - 20,
    },
  );
};
