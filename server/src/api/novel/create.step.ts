import { Handlers, ApiRouteConfig } from "motia";
import { z } from "zod";
import { connectDB } from "../../../config/db";
import { Novel, INovel } from "../../../models/novel.model";
import { auth } from "../../middlewares/auth.middleware";

const bodySchema = z.object({
  title: z.string().min(2).max(100),
  plot: z.string().min(20),
});

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
  name: "api.novel.create",
  path: "/api/novel",
  method: "POST",
  emits: ["generate.form.questions"],
  flows: ["api.novel.create"],
  middleware: [auth({ required: true })],
  bodySchema,
  responseSchema,
};

// @ts-ignore
export const handler: Handlers["api.novel.create"] = async (req, ctx) => {
  const { title, plot } = bodySchema.parse(req.body);
  const userId = (req as any).user.id;

  await connectDB();

  const newNovel = await Novel.create({
    title,
    plot,
    userId,
  });

  await ctx.emit({
    topic: "generate.form.questions",
    data: {
      novelId: newNovel._id,
    },
  });

  return {
    status: 200,
    body: {
      _id: newNovel?._id,
      title,
      plot,
      success: true,
    },
  };
};
