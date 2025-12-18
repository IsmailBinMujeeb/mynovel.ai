import { Handlers, ApiRouteConfig, ApiRequest } from "motia";
import mongoose from "mongoose";
import { z } from "zod";
import { connectDB } from "../../../config/db";
import { Novel, INovel } from "../../../models/novel.model";
import { auth } from "../../middlewares/auth.middleware";

const bodySchema = z.object({
  plot: z.string(),
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
  name: "api.novel.plot.enhancer",
  path: "/api/novel/plot-enhancer/:novelId",
  method: "POST",
  emits: ["plot.enhancer"],
  flows: ["flow.plot.enhancer"],
  middleware: [auth({ required: true })],
  bodySchema,
  responseSchema,
};

// @ts-ignore
export const handler: Handlers["api.novel.plot.enhancer"] = async (
  req,
  ctx,
) => {
  const novelId = (req as ApiRequest).pathParams.novelId;
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

  if (!novelId || !mongoose.isObjectIdOrHexString(novelId)) {
    return {
      status: 400,
      body: {
        success: false,
        error: "Invalid novel ID",
      },
    };
  }

  await connectDB();

  const isNovelExists = await Novel.findById(novelId);
  const { plot } = body.data;

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
      status: 401,
      body: {
        success: false,
        error: "User unauthorized to update this novel",
      },
    };
  }

  await ctx.emit({
    topic: "plot.enhancer",
    data: {
      novelId,
      plot,
    },
  });

  return {
    status: 200,
    body: {
      success: true,
    },
  };
};
