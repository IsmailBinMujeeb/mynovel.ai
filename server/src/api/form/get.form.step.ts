import { Handlers, ApiRouteConfig, ApiRequest } from "motia";
import { z } from "zod";
import { connectDB } from "../../../config/db";
import { Novel, INovel } from "../../../models/novel.model";
import mongoose from "mongoose";
import { auth } from "../../middlewares/auth.middleware";

const responseSchema = {
  200: z.object({
    level: z.number(),
    question: z.string(),
    answer: z.string(),
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
  404: z.object({
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
  name: "api.form.get",
  path: "/api/form/answer/:novelId",
  method: "GET",
  emits: [],
  flows: [],
  middleware: [auth({ required: true })],
  responseSchema,
};

// @ts-ignore
export const handler: Handlers["api.form.get"] = async (req, ctx) => {
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
        from: "forms",
        localField: "_id",
        foreignField: "novelId",
        as: "form",
      },
    },
    { $unwind: "$form" },
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
      form: novel.form,
      success: true,
    },
  };
};
