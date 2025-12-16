import { Handlers, ApiRouteConfig, ApiRequest } from "motia";
import { z } from "zod";
import { connectDB } from "../../../config/db";
import { Novel, INovel } from "../../../models/novel.model";
import { Chapter, IChapter } from "../../../models/chapter.model";
import { auth } from "../../middlewares/auth.middleware";
import mongoose from "mongoose";

const bodySchema = z.object({
  title: z.string().min(2).max(100),
  chapterPrompt: z.string(),
  chapterNumber: z.number().min(1),
  isPrologue: z.boolean().default(false),
  isEpilogue: z.boolean().default(false),
});

const responseSchema = {
  201: z.object({
    title: z.string().min(2).max(100),
    chapterPrompt: z.string(),
    chapterNumber: z.number().min(1),
    isPrologue: z.boolean().default(false),
    isEpilogue: z.boolean().default(false),
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
  name: "api.chapter.create",
  path: "/api/chapter/:novelId",
  method: "POST",
  emits: [],
  flows: [],
  middleware: [auth({ required: true })],
  bodySchema,
  responseSchema,
};

// @ts-ignore
export const handler: Handlers["api.novel.create"] = async (req, ctx) => {
  const body = bodySchema.safeParse(req.body);
  const userId = (req as any).user.id;
  const novelId = (req as ApiRequest).pathParams.novelId;

  if (!body.success) {
    return {
      status: 400,
      body: {
        success: false,
        error: body.error,
      },
    };
  }

  if (!novelId || !mongoose.isValidObjectId(novelId)) {
    return {
      status: 404,
      body: {
        success: false,
        error: "Invalid novel ID",
      },
    };
  }

  await connectDB();

  const isNovelExists = await Novel.findById(novelId);

  if (!isNovelExists) {
    return {
      status: 404,
      body: {
        success: false,
        error: "Novel not found",
      },
    };
  }

  if (isNovelExists.userId.toString() !== userId) {
    return {
      status: 403,
      body: {
        success: false,
        error: "User is not authorized to create a chapter for this novel",
      },
    };
  }

  const newChapter = await Chapter.create({
    title: body.data.title,
    chapterPrompt: body.data.chapterPrompt,
    chapterNumber: body.data.chapterNumber,
    content: "Lorem Ipsum",
    contentSummary: "Lorem Ipsum",
    isPrologue: body.data.isPrologue,
    isEpilogue: body.data.isEpilogue,
    wordCount: 2,
    readTime: Number((2 / 135).toFixed(0)),
    userId,
    novelId,
  });

  return {
    status: 201,
    body: {
      chapter: newChapter,
      success: true,
    },
  };
};
