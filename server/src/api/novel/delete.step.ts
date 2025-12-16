import { Handlers, ApiRouteConfig, ApiRequest } from "motia";
import mongoose from "mongoose";
import { z } from "zod";
import { connectDB } from "../../../config/db";
import { Novel, INovel } from "../../../models/novel.model";
import { auth } from "../../middlewares/auth.middleware";

const responseSchema = {
  200: z.object({
    title: z.string().min(2).max(100),
    plot: z.string().min(20),
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
  name: "api.novel.delete",
  path: "/api/novel/:novelId",
  method: "DELETE",
  emits: [],
  flows: [],
  middleware: [auth({ required: true })],
  responseSchema,
};

// @ts-ignore
export const handler: Handlers["api.novel.delete"] = async (req, ctx) => {
  const novelId = (req as ApiRequest).pathParams.novelId;
  const userId = (req as any).user.id;

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

  const newNovel = await Novel.findByIdAndDelete(novelId);

  return {
    status: 200,
    body: {
      _id: newNovel?._id,
      title: newNovel?.title,
      plot: newNovel?.plot,
      success: true,
    },
  };
};
