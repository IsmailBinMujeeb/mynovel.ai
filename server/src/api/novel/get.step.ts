import { Handlers, ApiRouteConfig, ApiRequest } from "motia";
import { z } from "zod";
import { connectDB } from "../../../config/db";
import { Novel, INovel } from "../../../models/novel.model";
import mongoose from "mongoose";
import { auth } from "../../middlewares/auth.middleware";

const responseSchema = {
  200: z.object({
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
  name: "api.novel.get",
  path: "/api/novel/n/:novelId",
  method: "GET",
  emits: [],
  flows: [],
  middleware: [auth({ required: true })],
  responseSchema,
};

// @ts-ignore
export const handler: Handlers["api.novel.get"] = async (req, ctx) => {
  const novelId = (req as ApiRequest).pathParams.novelId;
  const userId = (req as any).user.id;

  if (!novelId || !mongoose.isValidObjectId(novelId)) {
    return {
      status: 400,
      body: {
        success: false,
        error: "Novel ID is invalid",
      },
    };
  }

  await connectDB();

  const [novel] = await Novel.aggregate([
    {
      $match: {
        $and: [
          { _id: new mongoose.Types.ObjectId(novelId) },
          { userId: new mongoose.Types.ObjectId(userId) },
        ],
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
    {
      $project: {
        _id: 1,
        title: 1,
        plot: 1,
        coverPrompt: 1,
        chapters: 1,
        success: 1,
      },
    },
  ]);

  if (!novel) {
    return {
      status: 404,
      body: {
        success: false,
        error: "Novel not found",
      },
    };
  }

  return {
    status: 200,
    body: {
      title: novel.title,
      plot: novel.plot,
      coverPrompt: novel.coverPrompt,
      chapters: novel.chapters,
      success: true,
    },
  };
};
