import { Handlers, ApiRouteConfig, ApiRequest } from "motia";
import mongoose from "mongoose";
import { z } from "zod";
import { connectDB } from "../../../config/db";
import { Novel, INovel } from "../../../models/novel.model";
import { auth } from "../../middlewares/auth.middleware";
import { Credit } from "../../../models/credit.model";

const responseSchema = {
  200: z.object({
    credits: z.number(),
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
  name: "api.credits.update",
  path: "/api/credits/:creditId",
  method: "PUT",
  emits: [],
  flows: [],
  middleware: [auth({ required: true })],
  responseSchema,
};

// @ts-ignore
export const handler: Handlers["api.credits.update"] = async (req, ctx) => {
  const creditId = (req as ApiRequest).pathParams.creditId;
  const userId = (req as any).user.id;

  if (!creditId || !mongoose.isObjectIdOrHexString(creditId)) {
    return {
      status: 400,
      body: {
        success: false,
        error: "Invalid credit ID",
      },
    };
  }

  await connectDB();

  const isCreditExists = await Credit.findById(creditId);
  if (!isCreditExists) {
    return {
      status: 404,
      body: {
        success: false,
        error: "Credit not found",
      },
    };
  }

  if (isCreditExists.userId.toString() !== userId) {
    return {
      status: 401,
      body: {
        success: false,
        error: "User unauthorized to update this credit",
      },
    };
  }

  const newCredit = await Credit.findByIdAndUpdate(
    creditId,
    {
      boughtCredits: isCreditExists.boughtCredits + 20,
    },
    { new: true },
  );

  if (!newCredit) {
    return {
      status: 404,
      body: {
        success: false,
        error: "Credit not found",
      },
    };
  }

  return {
    status: 200,
    body: {
      credits: newCredit.boughtCredits + newCredit.dailyCredits,
      success: true,
    },
  };
};
