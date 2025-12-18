import { Handlers, EventConfig } from "@motiadev/core";
import { connectDB } from "../../config/db";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import env from "../../config/env";
import { Chapter } from "../../models/chapter.model";

export const config: EventConfig = {
  type: "event",
  name: "event.summarize.chapter",
  description: "Generates summary of a chapter for a novel",
  emits: [],
  subscribes: ["summarize.chapter"],
  flows: ["update.chapter"],
};

// @ts-ignore
export const handler: Handlers["event.summarize.chapter"] = async (
  input: any,
  ctx: any,
) => {
  const { chapterId } = input;

  await connectDB();

  const chapter = await Chapter.findById(chapterId);

  if (!chapter) {
    throw new Error("Chapter not found");
  }

  const model = new ChatGoogleGenerativeAI({
    model: "gemma-3-27b-it",
    temperature: 0.3,
    apiKey: env.GEMINI_API_KEY,
  });

  const response = await model.invoke(
    `System prompt: ${SYSTEM_PROMPT}. Core objectives: ${CORE_OBJECTIVES} Input: ${INPUT}. Output requirements: ${OUTPUT_REQUIREMENTS}. Rules: ${RULES}. Remove descriptive language, Prefer factual phrasing, Combine repeated actions, Preserve causality, Keep names consistent. The output should read like internal continuity notes passed between writers, precise, neutral, and actionable. Output only the chapter summary in the specified format. No meta commentary. No creative prose. No formatting symbols. Chapter content: ${chapter.content}`,
  );
  ctx.logger.info(response.content);

  chapter.contentSummary = response.content as string;
  await chapter.save();
};

const SYSTEM_PROMPT = `You are a professional story editor and continuity manager. Your task is to summarize a single novel chapter into a compact, factual continuity summary that another AI model will use as context to write the next chapter.`;
const CORE_OBJECTIVES = `Extract and preserve only what matters for future chapters, including: Plot developments, Character actions and decisions, Emotional and psychological shifts, New information revealed, Unresolved tensions`;
const OUTPUT_REQUIREMENTS = `Output the summary using short labeled sections, written as compact paragraphs, in the following order:
Story Events
Describe the key events of the chapter in chronological order. Focus on actions and outcomes.

Character State Updates
For each character who appears:
What they did
Any decisions made
Any emotional or mental shifts explicitly shown
New Information or Revelations
List any new facts, secrets, rules, or knowledge revealed in this chapter.
Unresolved Threads
Identify conflicts, questions, dangers, or goals that remain open at the end of the chapter.
Setting or World Changes
Note any significant changes in location, time, or world conditions, if applicable.`;
const RULES = `Do NOT rewrite the chapter creatively, Do NOT add interpretation or analysis, Do NOT invent details or motivations, Do NOT predict future events, Do NOT evaluate writing quality, Do NOT include themes unless explicitly shown, Do NOT address the reader or user, Plain text only (no Markdown, no bullets)`;
const INPUT = `The full text of one chapter`;
