import { Handlers, ApiRouteConfig } from "motia";
import { z } from "zod";
import { connectDB } from "../../../config/db";
import { Novel } from "../../../models/novel.model";
import { auth } from "../../middlewares/auth.middleware";
import mongoose from "mongoose";

const responseSchema = {
  200: z.object({
    novels: z.array(
      z.object({
        _id: z.string(),
        title: z.string().min(2).max(100),
        plot: z.string().min(20),
        coverPrompt: z.string(),
        chapters: z.array(
          z.object({
            _id: z.string(),
            title: z.string().min(2).max(100),
            content: z.string().min(20),
            novelId: z.string(),
            chapterPrompt: z.string(),
            chapterNumber: z.number(),
            isPrologue: z.boolean(),
            isEpilogue: z.boolean(),
            contentSummary: z.string(),
          }),
        ),
      }),
    ),
    success: z.boolean(),
  }),
  400: z.object({
    success: z.boolean(),
    error: z.string(),
  }),
  401: z.object({
    success: z.boolean(),
    error: z.string(),
  }),
  500: z.object({
    success: z.boolean(),
    error: z.string(),
  }),
};

export const config: ApiRouteConfig = {
  type: "api",
  name: "api.all.novel.get",
  path: "/api/novel/",
  method: "GET",
  emits: [],
  flows: [],
  middleware: [auth({ required: true })],
  responseSchema,
};

// @ts-ignore
export const handler: Handlers["api.all.novel.get"] = async (req, ctx) => {
  const userId = (req as any).user.id;

  await connectDB();

  const novels = await Novel.aggregate([
    {
      $match: {
        userId: new mongoose.Types.ObjectId(userId),
      },
    },
    {
      $lookup: {
        from: "chapters",
        localField: "_id",
        foreignField: "novelId",
        as: "chapters",
      },
    },
  ]);

  return {
    status: 200,
    body: {
      novels,
      success: true,
    },
  };
};
