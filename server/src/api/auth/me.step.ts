import { ApiRouteConfig, Handlers } from "motia";
import { z } from "zod";
import { auth } from "../../middlewares/auth.middleware";
import { connectDB } from "../../../config/db";
import User from "../../../models/user.model";
import mongoose from "mongoose";

const responseSchema = {
  200: z.object({
    user: z.object({
      id: z.string(),
      email: z.email(),
      username: z.string(),
      avatar: z.url(),
      createdAt: z.iso.datetime(),
      updatedAt: z.iso.datetime(),
    }),
  }),
  401: z.object({ error: z.string() }),
  404: z.object({ error: z.string() }),
  500: z.object({ error: z.string() }),
};

export const config: ApiRouteConfig = {
  type: "api",
  name: "auth.me",
  description: "Get user information",
  path: "/auth/me",
  method: "GET",
  emits: [],
  middleware: [auth({ required: true })],
  flows: ["auth"],
  responseSchema: responseSchema,
};

// @ts-ignore
export const handler: Handlers["auth.me"] = async (req, ctx) => {
  // @ts-ignore
  const userId = req.user?.id;

  await connectDB();
  const [user] = await User.aggregate([
    {
      $match: { _id: new mongoose.Types.ObjectId(userId) },
    },
    {
      $lookup: {
        from: "credits",
        localField: "_id",
        foreignField: "userId",
        as: "credits",
      },
    },
    {
      $unwind: "$credits",
    },
    {
      $project: {
        _id: 1,
        email: 1,
        username: 1,
        avatar: 1,
        credits: 1,
        createdAt: 1,
        updatedAt: 1,
      },
    },
  ]);

  if (!user) {
    return {
      status: 404,
      body: { error: "User not found" },
    };
  }

  ctx.state.set("credits", user._id.toString(), {
    dailyCredits: user.credits.dailyCredits,
    boughtCredits: user.credits.boughtCredits,
  });

  return {
    status: 200,
    body: {
      user,
    },
  };
};
