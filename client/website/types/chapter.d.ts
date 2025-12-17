export interface Chapter {
  _id: string;
  title: string;
  novelId: string;
  userId: string;
  content: string;
  chapterPrompt: string;
  chapterNumber: number;
  isPrologue: boolean;
  isEpilogue: boolean;
  wordCount: number;
  readTime: number; // in minutes
  contentSummary: string;
  createdAt: Date;
  updatedAt: Date;
}
