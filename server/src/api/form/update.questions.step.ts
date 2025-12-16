import { Handlers, ApiRouteConfig, ApiRequest } from "motia";
import { z } from "zod";
import { connectDB } from "../../../config/db";
import { Novel, INovel } from "../../../models/novel.model";
import { Form, IFormField } from "../../../models/form.model";
import mongoose from "mongoose";
import { auth } from "../../middlewares/auth.middleware";

const bodySchema = z.object({
  answer: z.string(),
});

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
  name: "api.form.update",
  path: "/api/form/answer/:formId/:level",
  method: "PUT",
  emits: [],
  flows: [],
  middleware: [auth({ required: true })],
  bodySchema,
  responseSchema,
};

// @ts-ignore
export const handler: Handlers["api.form.update"] = async (req, ctx) => {
  const formId = (req as ApiRequest).pathParams.formId;
  const level = (req as ApiRequest).pathParams.level;
  const userId = (req as any).user.id;
  const body = bodySchema.safeParse(req.body);

  if (!body.success) {
    return {
      status: 400,
      body: {
        success: false,
        error: "Invalid answer",
      },
    };
  }

  if (!formId || !mongoose.isValidObjectId(formId)) {
    return {
      status: 400,
      body: {
        success: false,
        error: "Form ID is invalid",
      },
    };
  }

  await connectDB();

  const form = await Form.findOne({
    $and: [{ _id: formId }, { userId }],
  });

  if (!form) {
    return {
      status: 404,
      body: {
        success: false,
        error: "Form not found",
      },
    };
  }

  const updatedFields = form.fields.map((field) => {
    if (field.level !== Number(level)) return field;

    return {
      label: field.label,
      level,
      answer: body.data.answer,
      isAnswered: true,
    };
  });

  const isAllQuestionsAnswered = updatedFields.every(
    (field) => field.isAnswered,
  );

  const updatedForm = await Form.findByIdAndUpdate(
    formId,
    { fields: updatedFields, isAllQuestionsAnswered },
    { new: true },
  );

  return {
    status: 200,
    body: {
      form: updatedForm,
      success: true,
    },
  };
};
