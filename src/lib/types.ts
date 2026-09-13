export type Deck = {
  id: string;
  title: string;
  description: string | null;
  color: string;
  cards: number;
  due: number;
};

export type StudyCard = {
  id: string;
  deck_id: string;
  question: string;
  answer: string;
  due_at: string;
  reps: number;
  lapses: number;
  state: "new" | "learning" | "review" | "relearning";
  deckTitle: string;
};

export type AppUser = { id: string; email: string };
