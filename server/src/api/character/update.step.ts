import mongoose from "mongoose";
import { Handlers, ApiRouteConfig } from "motia";
import { auth } from "../../middlewares/auth.middleware";
import { z } from "zod";
import { Character } from "../../../models/character.model";
import { connectDB } from "../../../config/db";

const bodySchema = z.object({
  name: z.string().min(2).max(100),
  personality: z.string().min(10).max(500),
  role: z.string().min(2).max(100),
  age: z.number().min(0),
});

const responseSchema = {
  200: z.object({
    name: z.string().min(2).max(100),
    personality: z.string().min(10).max(500),
    role: z.string().min(2).max(100),
    age: z.number().min(0),
    _id: z.uuid(),
    novelId: z.uuid(),
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
  name: "api.character.update",
  path: "/api/character/:characterId",
  method: "PUT",
  emits: [],
  flows: [],
  middleware: [auth({ required: true })],
  bodySchema,
  responseSchema,
};

// @ts-ignore
export const handler: Handlers["api.character.update"] = async (req, ctx) => {
  const { characterId } = req.pathParams;
  const body = bodySchema.safeParse(req.body);

  if (!body.success) {
    return {
      status: 400,
      body: {
        success: false,
        error: body.error.message,
      },
    };
  }

  if (!characterId || !mongoose.isValidObjectId(characterId)) {
    return {
      status: 400,
      body: {
        success: false,
        error: "Invalid character ID",
      },
    };
  }

  await connectDB();

  const character = await Character.findByIdAndUpdate(
    characterId,
    {
      name: body.data.name,
      personality: body.data.personality,
      role: body.data.role,
      age: body.data.age,
    },
    { new: true },
  );

  if (!character) {
    return {
      status: 404,
      body: {
        success: false,
        error: "Character not found",
      },
    };
  }

  return {
    status: 201,
    body: {
      success: true,
      name: character.name,
      personality: character.personality,
      role: character.role,
      age: character.age,
      _id: character._id,
      novelId: character.novelId,
    },
  };
};
