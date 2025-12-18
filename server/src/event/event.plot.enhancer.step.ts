import { Handlers, EventConfig } from "@motiadev/core";
import { connectDB } from "../../config/db";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { Form } from "../../models/form.model";
import env from "../../config/env";
import { Novel } from "models/novel.model";

export const config: EventConfig = {
  type: "event",
  name: "event.plot.enhancer",
  description: "Enhances the plot of a novel",
  emits: [],
  subscribes: ["plot.enhancer"],
  flows: ["flow.plot.enhancer"],
};

// @ts-ignore
export const handler: Handlers["event.plot.enhancer"] = async (
  input: any,
  ctx: any,
) => {
  const { novelId, plot } = input;

  await connectDB();

  const form = await Form.findOne({ novelId });

  if (!form) {
    throw new Error("Form not found");
  }

  if (!form.isAllQuestionsAnswered) {
    throw new Error("Form not answered");
  }

  const model = new ChatGoogleGenerativeAI({
    model: "gemma-3-12b-it",
    temperature: 0.7,
    apiKey: env.GEMINI_API_KEY,
  });

  const response = await model.stream(
    `System prompt: ${SYSTEM_PROMPT}. Core objectives: ${CORE_OBJECTIVES}. Summary: ${form.summary}. Existing Plot: ${plot}. Output requirements: ${OUTPUT_REQUIREMENTS}. Rules: ${RULES}. Produce the enhanced plot analysis. Plain text only. No meta commentary. No creative prose. No questions. No Markdown`,
  );
  let chunkContent = "";

  for await (const chunk of response) {
    if (chunk.content) {
      chunkContent += chunk.content;
      await ctx.streams.plotEenhancerStream.set(
        "gid.plot.enhancer.stream",
        novelId,
        {
          plot: chunkContent,
          isCompleted: false,
        },
      );
    }
  }

  await ctx.streams.plotEenhancerStream.set(
    "gid.plot.enhancer.stream",
    novelId,
    {
      plot: chunkContent,
      isCompleted: true,
    },
  );
};

const SYSTEM_PROMPT = `You are a professional story editor and plot architect. Your task is to enhance, strengthen, and clarify the novel’s plot using the provided story context summary.`;
const CORE_OBJECTIVES = `Transform the existing context into a stronger, more compelling plot by: Clarifying causality, Increasing narrative tension, Strengthening character motivation, Improving stakes and momentum, You are not writing chapters or prose — only refining the plot design.`;
const OUTPUT_REQUIREMENTS = `DO NOT rewrite the questions DO NOT invent new details DO NOT interpret beyond what is stated DO NOT include commentary, explanations, or meta text. DO NOT address the user directly. DO NOT markdown output only text ONLY output the summarized brief`;
const RULES = `Do NOT change genre, tone, or ending preference, Do NOT introduce new main characters, Do NOT contradict established world rules, Do NOT overwrite the author’s intent, Do NOT write dialogue or novel-style prose, Enhance, don’t reinvent`;
