import { Handlers, ApiRouteConfig, ApiRequest, FlowContext, Emit } from "motia";
import mongoose from "mongoose";
import { z } from "zod";
import { connectDB } from "../../../config/db";
import { auth } from "../../middlewares/auth.middleware";
import { Chapter } from "../../../models/chapter.model";

const bodySchema = z.object({
  content: z.string(),
  prompt: z.string(),
  title: z.string(),
});

const responseSchema = {
  200: z.object({
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
  name: "api.novel.write.chapter",
  path: "/api/novel/write-chapter/:chapterId",
  method: "POST",
  emits: ["write.chapter"],
  flows: ["flow.write.chapter"],
  middleware: [auth({ required: true })],
  bodySchema,
  responseSchema,
};

// @ts-ignore
export const handler: Handlers["api.novel.write.chapter"] = async (
  req: ApiRequest,
  ctx: FlowContext<Emit>,
) => {
  const chapterId = req.pathParams.chapterId;
  const body = bodySchema.safeParse(req.body);
  const userId = (req as any).user.id;

  if (!body.success) {
    return {
      status: 400,
      body: {
        success: false,
        error: "Invalid request body",
      },
    };
  }

  if (!chapterId || !mongoose.isObjectIdOrHexString(chapterId)) {
    return {
      status: 400,
      body: {
        success: false,
        error: "Invalid chapter ID",
      },
    };
  }

  await connectDB();

  const isChapterExists = await Chapter.findById(chapterId);

  if (!isChapterExists) {
    return {
      status: 404,
      body: {
        success: false,
        error: "Chapter not found",
      },
    };
  }

  if (isChapterExists.userId.toString() !== userId) {
    return {
      status: 401,
      body: {
        success: false,
        error: "User unauthorized to update this chapter",
      },
    };
  }

  await ctx.emit({
    topic: "write.chapter",
    data: {
      novelId: isChapterExists.novelId,
      prompt: body.data.prompt,
      content: body.data.content,
      title: body.data.title,
      userId,
    },
  });

  return {
    status: 200,
    body: {
      success: true,
    },
  };
};
