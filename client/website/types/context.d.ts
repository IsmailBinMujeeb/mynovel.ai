export interface ContextField {
  label: string;
  answer: string | null;
  level: number;
  isAnswered: boolean;
  _id: string;
}

export interface Context {
  _id: string;
  novelId: string;
  fields: ContextField[];
  userId: string;
  isAllQuestionsAnswered: boolean;
  createdAt: Date;
  updatedAt: Date;
}
