import mongoose from "mongoose";
import { Handlers, ApiRouteConfig } from "motia";
import { auth } from "../../middlewares/auth.middleware";
import { z } from "zod";
import { Character } from "../../../models/character.model";
import { connectDB } from "../../../config/db";

const responseSchema = {
  200: z.object({
    characters: z.array(
      z.object({
        name: z.string().min(2).max(100),
        personality: z.string().min(10).max(500),
        role: z.string().min(2).max(100),
        age: z.number().min(0),
        _id: z.uuid(),
        novelId: z.uuid(),
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
  name: "api.character.get.all",
  path: "/api/characters/:novelId",
  method: "GET",
  emits: [],
  flows: [],
  middleware: [auth({ required: true })],
  responseSchema,
};

// @ts-ignore
export const handler: Handlers["api.character.get.all"] = async (req, ctx) => {
  const { novelId } = req.pathParams;

  if (!novelId || !mongoose.isValidObjectId(novelId)) {
    return {
      status: 400,
      body: {
        success: false,
        error: "Invalid novel ID",
      },
    };
  }

  await connectDB();

  const characters = await Character.find({ novelId });

  return {
    status: 200,
    body: {
      success: true,
      characters,
    },
  };
};
