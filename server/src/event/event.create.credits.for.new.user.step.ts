import { Handlers, EventConfig } from "@motiadev/core";
import { connectDB } from "../../config/db";
import { Credit } from "../../models/credit.model";

export const config: EventConfig = {
  type: "event",
  name: "event.create.credits.for.new.user.step",
  description: "Generates credits for a new user",
  emits: [],
  subscribes: ["create.new.user.credits"],
  flows: ["api.auth.register"],
};

// @ts-ignore
export const handler: Handlers["event.create.credits.for.new.user.step"] =
  async (input: any, ctx: any) => {
    const { userId } = input;

    await connectDB();

    const newCredits = await Credit.create({
      userId,
    });

    if (!newCredits) {
      throw new Error("Failed to create credits");
    }
  };
