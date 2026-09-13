import { encodeQuestionContent, type Difficulty, type QuestionType } from "@/lib/question-content";

export const previewDecks = [
  { id: "demo-product", title: "Product sense", description: "Questions produit & stratégie", color: "coral" },
  { id: "demo-star", title: "Expériences passées", description: "Méthode STAR & leadership", color: "violet" },
  { id: "demo-culture", title: "Culture & motivation", description: "Valeurs, rôle et entreprise", color: "mint" },
];

const questions = [
  ["Comment prioriserais-tu les fonctionnalités d’un nouveau produit ?", "Clarifier l’objectif, comparer impact et effort, intégrer les signaux utilisateurs, puis expliciter les compromis."],
  ["Comment mesurerais-tu le succès d’un lancement ?", "Définir une métrique principale, des garde-fous et une fenêtre d’observation avant le lancement."],
  ["Raconte une situation où tu as dû convaincre sans autorité.", "Structurer la réponse avec Situation, Tâche, Action et Résultat, puis préciser l’apprentissage."],
  ["Comment réagis-tu à un désaccord avec ton manager ?", "Revenir aux faits et à l’objectif commun, écouter, proposer un test et documenter la décision."],
  ["Pourquoi souhaites-tu rejoindre cette entreprise ?", "Relier précisément la mission, le rôle et l’environnement de l’entreprise à son propre parcours."],
  ["Quelle est ta principale zone de progression ?", "Choisir un axe réel mais maîtrisable, puis montrer les actions et progrès déjà engagés."],
];

export const previewCards = Array.from({ length: 18 }, (_, index) => {
  const type: QuestionType = index % 4 === 0 ? "multiple_choice" : "simple";
  const difficulty = ["beginner", "intermediate", "advanced"][index % 3] as Difficulty;
  const [question, explanation] = questions[index % questions.length];
  return {
    id: `demo-card-${index}`,
    deck_id: previewDecks[index % previewDecks.length].id,
    question,
    answer: encodeQuestionContent({ type, difficulty, answer: explanation, options: type === "multiple_choice" ? ["Impact seulement", "Impact, effort et risques", "Ordre d’arrivée", "Intuition"] : [], correctOption: type === "multiple_choice" ? 1 : null }),
    due_at: new Date(0).toISOString(), reps: index < 13 ? 1 : 0, lapses: 0, state: index < 13 ? "review" : "new",
  };
});

export function getPreviewReviews() {
  const now = Date.now();
  return Array.from({ length: 34 }, (_, index) => ({ id: `demo-review-${index}`, card_id: `demo-card-${index % 13}`, rating: [3, 4, 3, 2, 1, 4][index % 6], reviewed_at: new Date(now - (index % 14) * 86_400_000).toISOString() }));
}

export function isPreviewVisitor() {
  return process.env.VERCEL_ENV === "preview" || !process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
}
