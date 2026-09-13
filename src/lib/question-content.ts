export type QuestionType = "simple" | "multiple_choice";
export type Difficulty = "beginner" | "intermediate" | "advanced";
export type QuestionContent = { type: QuestionType; difficulty: Difficulty; answer: string; options: string[]; correctOption: number | null };

const PREFIX = "__IT_V1__";

export function parseQuestionContent(value: string): QuestionContent {
  if (!value.startsWith(PREFIX)) return { type: "simple", difficulty: "intermediate", answer: value, options: [], correctOption: null };
  try {
    const data = JSON.parse(value.slice(PREFIX.length)) as QuestionContent;
    return data;
  } catch {
    return { type: "simple", difficulty: "intermediate", answer: value, options: [], correctOption: null };
  }
}

export function encodeQuestionContent(value: QuestionContent) {
  return PREFIX + JSON.stringify(value);
}

export const difficultyLabels = { beginner: "Débutant", intermediate: "Intermédiaire", advanced: "Avancé" } as const;
export const typeLabels = { simple: "Réponse à révéler", multiple_choice: "Choix multiple" } as const;
