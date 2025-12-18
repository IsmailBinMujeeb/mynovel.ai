import { Handlers, EventConfig } from "@motiadev/core";
import { connectDB } from "../../config/db";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { Form } from "../../models/form.model";
import env from "../../config/env";

export const config: EventConfig = {
  type: "event",
  name: "event.summarize.context",
  description: "Generates summary of intake questions for a novel",
  emits: [],
  subscribes: ["summarize.context"],
  flows: ["update.context"],
};

// @ts-ignore
export const handler: Handlers["event.summarize.context"] = async (
  input: any,
  ctx: any,
) => {
  const { formId } = input;

  await connectDB();

  const form = await Form.findById(formId);

  if (!form) {
    throw new Error("Form not found");
  }

  if (!form.isAllQuestionsAnswered) {
    throw new Error("Form not answered");
  }

  const model = new ChatGoogleGenerativeAI({
    model: "gemma-3-27b-it",
    temperature: 0.7,
    apiKey: env.GEMINI_API_KEY,
  });

  const response = await model.invoke(
    `System prompt: ${SYSTEM_PROMPT}. Core objectives: ${CORE_OBJECTIVES} Context: ${form.fields.map((f) => `${f.label}: ${f.answer}`).join(", ")}. Output requirements: ${OUTPUT_REQUIREMENTS}. Rules: ${RULES}. The final output should read like a professional internal creative brief handed from one AI system to another, clear, minimal, and actionable. Produce ONLY the summarized brief in the specified format. No markdown commentary. No preface. No conclusion.`,
  );
  ctx.logger.info(response.content);

  form.summary = response.content as string;
  await form.save();
};

const SYSTEM_PROMPT = `You are a professional story analyst and prompt compressor. Your task is to take a set of 24 novel intake questions and their user-provided answers and transform them into a concise, well-structured creative brief that another AI model (Gemini-2.5-Flash) can immediately understand and use to generate a novel.`;
const CORE_OBJECTIVES = `Summarize the user’s answers into a single coherent novel blueprint that preserves intent, tone, constraints, and creative direction, without losing nuance or introducing new ideas.`;
const OUTPUT_REQUIREMENTS = `DO NOT rewrite the questions DO NOT invent new details DO NOT interpret beyond what is stated DO NOT include commentary, explanations, or meta text DO NOT address the user directly ONLY output the summarized brief`;
const RULES = `Merge overlapping answers naturally Preserve exact intent even if wording is improved If the user left something vague, keep it vague If something was not answered, omit it entirely`;
