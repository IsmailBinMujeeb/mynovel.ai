import { Handlers, EventConfig } from "@motiadev/core";
import { connectDB } from "../../config/db";
import { Novel } from "../../models/novel.model";
import { Form } from "../../models/form.model";

export const config: EventConfig = {
  type: "event",
  name: "event.generate.form.questions",
  description: "Generates form intake questions for a novel",
  emits: [],
  subscribes: ["generate.form.questions"],
  flows: ["api.novel.create"],
};

// @ts-ignore
export const handler: Handlers["event.generate.form.questions"] = async (
  input: any,
  ctx: any,
) => {
  const { novelId } = input;

  await connectDB();

  const novel = await Novel.findById(novelId);

  if (!novel) {
    throw new Error("Novel not found");
  }

  const newForm = await Form.create({
    novelId,
    fields: intakeQuestions,
  });

  if (!newForm) {
    throw new Error("Failed to create form");
  }
};

const intakeQuestions = [
  {
    label:
      "What genre(s) do you want? (e.g., romance, fantasy, thriller, sci-fi)",
    level: 1,
  },
  {
    label: "Any books, authors, or movies you want it to feel like?",
    level: 2,
  },
  {
    label: "Do you want it fast-paced or slow and detailed?",
    level: 3,
  },
  {
    label: "Serious, dark, humorous, or light-hearted?",
    level: 4,
  },
  {
    label: "First-person or third-person narration?",
    level: 5,
  },
  {
    label: "What is the main conflict or problem?",
    level: 6,
  },
  {
    label:
      "What themes matter to you? (love, revenge, identity, freedom, etc.)",
    level: 7,
  },
  {
    label: "Do you want a happy ending, tragic ending, or open ending?",
    level: 8,
  },
  {
    label: "Who is the protagonist?",
    level: 9,
  },
  {
    label: "Age, gender, personality, strengths, flaws?",
    level: 10,
  },
  {
    label: "Who is the antagonist (villain, rival, or opposing force)?",
    level: 11,
  },
  {
    label: "Any must-have side characters?",
    level: 12,
  },
  {
    label:
      "Where does the story take place? (city, country, fantasy world, future?)",
    level: 13,
  },
  {
    label: "When does it take place? (past, present, future)",
    level: 14,
  },
  {
    label: "Are there special rules? (magic, technology, social systems)",
    level: 15,
  },
  {
    label: "Should the world feel realistic or exaggerated?",
    level: 16,
  },
  {
    label: "Do you want plot twists? If yes, how shocking?",
    level: 17,
  },
  {
    label: "How much violence is okay?",
    level: 18,
  },
  {
    label: "Is romance included? How explicit?",
    level: 19,
  },
  {
    label: "Is strong language okay?",
    level: 20,
  },
  {
    label: "Approximate word count for a single chapter? (e.g., 2k, 3k, 5k)",
    level: 21,
  },
  {
    label: "Can I change ideas if something doesn’t work?",
    level: 22,
  },
  {
    label: "What emotion do you want readers to feel at the end?",
    level: 23,
  },
  {
    label: "If you could describe the book in one sentence, what would it be?",
    level: 24,
  },
];
