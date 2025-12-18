import { Handlers, ApiRouteConfig } from "motia";
import { z } from "zod";
import { connectDB } from "../../../config/db";
import { Novel, INovel } from "../../../models/novel.model";
import { Form, IFormField } from "../../../models/form.model";
import mongoose from "mongoose";
import { auth } from "../../middlewares/auth.middleware";

const bodySchema = z.object({
  fields: z.array(
    z.object({
      label: z.string(),
      level: z.number(),
      _id: z.string(),
      answer: z.string(),
      isAnswered: z.boolean(),
    }),
  ),
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
  path: "/api/form/answer/:formId",
  method: "PUT",
  emits: ["summarize.context"],
  flows: ["update.context"],
  middleware: [auth({ required: true })],
  bodySchema,
  responseSchema,
};

// @ts-ignore
export const handler: Handlers["api.form.update"] = async (req, ctx) => {
  const formId = req.pathParams.formId;
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

  const updatedFields = form.fields.map((dbField, index) => {
    const userSendedField = body.data.fields[index];
    if (dbField.level !== userSendedField.level) return dbField;

    return {
      label: dbField.label,
      level: dbField.level,
      answer: userSendedField.answer,
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

  if (isAllQuestionsAnswered) {
    await ctx.emit({
      topic: "summarize.context",
      data: {
        formId: updatedForm?._id,
      },
    });
  }

  return {
    status: 200,
    body: {
      form: updatedForm,
      success: true,
    },
  };
};
