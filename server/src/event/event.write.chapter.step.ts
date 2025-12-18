import { Handlers, EventConfig } from "@motiadev/core";
import { connectDB } from "../../config/db";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { Form, IForm } from "../../models/form.model";
import env from "../../config/env";
import { Novel } from "../../models/novel.model";
import mongoose from "mongoose";
import { IChapter } from "../../models/chapter.model";

export const config: EventConfig = {
  type: "event",
  name: "event.write.chapter",
  description: "Writes a chapter of a novel",
  emits: [],
  subscribes: ["write.chapter"],
  flows: ["flow.write.chapter"],
};

// @ts-ignore
export const handler: Handlers["event.write.chapter"] = async (
  input: any,
  ctx: any,
) => {
  const { novelId, prompt, title } = input;

  await connectDB();

  const [novel] = await Novel.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(novelId),
      },
    },
    {
      $lookup: {
        from: "chapters",
        localField: "_id",
        foreignField: "novelId",
        as: "chapters",
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
    {
      $unwind: "$form",
    },
    {
      $project: {
        _id: 1,
        form: 1,
        chapters: {
          $map: {
            input: "$chapters",
            as: "chapter",
            in: {
              _id: "$$chapter._id",
              title: "$$chapter.title",
              contentSummary: "$$chapter.contentSummary",
            },
          },
        },
      },
    },
  ]);

  if (!novel) {
    throw new Error("Novel not found");
  }

  const form = novel.form as IForm;
  const chapters = novel.chapters as IChapter[];

  if (!form) {
    throw new Error("Form not found");
  }

  if (!form.isAllQuestionsAnswered) {
    throw new Error("Form not answered");
  }

  const model = new ChatGoogleGenerativeAI({
    model: "gemini-2.5-flash",
    temperature: 0.7,
    apiKey: env.GEMINI_API_KEY,
  });

  const response = await model.stream(
    `System prompt: ${SYSTEM_PROMPT}. Inputs: ${INPUTS}. Core objectives: ${CORE_OBJECTIVES}. Novel title ${title}. Novel Briefs: ${form.summary}. User prompt: ${prompt}. Other Chapter's summaries ${chapters.map((chapter) => `${chapter.title}: ${chapter.contentSummary}`).join(", ")}. Output requirements: ${OUTPUT_REQUIREMENTS}. Rules: ${RULES}. Style of writing: ${STYLE_OF_WRITING}.`,
  );
  let chunkContent = "";

  for await (const chunk of response) {
    if (chunk.content) {
      chunkContent += chunk.content;
      await ctx.streams.writeChapterStream.set(
        "gid.write.chapter.stream",
        novelId,
        {
          content: chunkContent,
          isCompleted: false,
        },
      );
    }
  }

  await ctx.streams.writeChapterStream.set(
    "gid.write.chapter.stream",
    novelId,
    {
      content: chunkContent,
      isCompleted: true,
    },
  );
};

const SYSTEM_PROMPT = `You are a professional novelist and scene writer. Your task is to write one complete novel chapter using the provided context while maintaining consistency with the established story, characters, tone, and world.`;
const CORE_OBJECTIVES = `Write a fully developed chapter that: Advances the plot meaningfully, Deepens character arcs, Maintains narrative continuity, Matches the established tone and pacing, Ends with forward momentum`;
const OUTPUT_REQUIREMENTS = `DO NOT rewrite the questions DO NOT invent new details DO NOT interpret beyond what is stated DO NOT include commentary, explanations, or meta text. DO NOT address the user directly. DO NOT markdown output only text ONLY output the summarized brief`;
const RULES = `Write ONLY this chapter, Do NOT summarize or recap previous chapters, Do NOT contradict established facts, Do NOT introduce unexplained lore or rules, Do NOT resolve major conflicts prematurely, Do NOT write meta commentary or explanations, Do NOT mention the brief or context, No Markdown formatting, Plain narrative prose only`;
const INPUTS = `Chapter Title, User Prompt / Chapter Intent, Novel Brief (story premise, tone, themes, characters, world rules), Summaries of Previous Chapters`;
const STYLE_OF_WRITING = `Show, don’t tell, Use sensory detail where relevant, Natural, purposeful dialogue, Maintain consistent POV, Match the novel’s tone and genre, Avoid clichés and filler`;
