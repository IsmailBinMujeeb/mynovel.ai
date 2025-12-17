import { Handlers, ApiRouteConfig, ApiRequest } from "motia";
import { z } from "zod";
import { connectDB } from "../../../config/db";
import mongoose from "mongoose";
import { auth } from "../../middlewares/auth.middleware";
import { Chapter } from "../../../models/chapter.model";

const bodySchema = z.object({
  title: z.string().min(2).max(100),
  content: z.string(),
  chapterNumber: z.number(),
});

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
  name: "api.chapter.update",
  path: "/api/chapter/:chapterId",
  method: "PUT",
  emits: [],
  flows: [],
  middleware: [auth({ required: true })],
  bodySchema,
  responseSchema,
};

// @ts-ignore
export const handler: Handlers["api.chapter.update"] = async (req, ctx) => {
  const chapterId = (req as ApiRequest).pathParams.chapterId;
  const userId = (req as any).user.id;
  const body = bodySchema.safeParse(req.body);

  if (!chapterId || !mongoose.isValidObjectId(chapterId)) {
    return {
      status: 400,
      body: {
        success: false,
        error: "Chapter ID is invalid",
      },
    };
  }

  if (!body.success) {
    return {
      status: 400,
      body: {
        success: false,
        error: "Invalid request body",
      },
    };
  }

  await connectDB();

  const chapter = await Chapter.findOneAndUpdate(
    {
      $and: [{ _id: chapterId }, { userId: userId }],
    },
    {
      title: body.data.title,
      content: body.data.content,
      chapterNumber: body.data.chapterNumber,
      wordCount: body.data.content.split(" ").length,
      readTime: Math.ceil(body.data.content.split(" ").length / 135),
    },
    { new: true },
  );

  if (!chapter) {
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
      chapter,
      success: true,
    },
  };
};
