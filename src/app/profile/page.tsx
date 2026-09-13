import { ProfileDashboard } from "@/components/profile-dashboard";
import { createClient } from "@/lib/supabase/server";
import { encodeQuestionContent, type Difficulty, type QuestionType } from "@/lib/question-content";

const demoDecks = [{ id: "demo-ifrs", title: "IFRS & French GAAP" }, { id: "demo-cases", title: "Études de cas" }];
const demoCards = Array.from({ length: 18 }, (_, index) => {
  const type: QuestionType = index % 4 === 0 ? "multiple_choice" : "simple";
  const difficulty = ["beginner", "intermediate", "advanced"][index % 3] as Difficulty;
  return { id: `demo-card-${index}`, deck_id: index < 12 ? "demo-ifrs" : "demo-cases", answer: encodeQuestionContent({ type, difficulty, answer: "Réponse de démonstration", options: type === "multiple_choice" ? ["A", "B", "C"] : [], correctOption: type === "multiple_choice" ? 1 : null }), reps: index < 13 ? 1 : 0, state: index < 13 ? "review" : "new" };
});

function getDemoReviews() {
  const now = Date.now();
  return Array.from({ length: 34 }, (_, index) => ({ id: `demo-review-${index}`, card_id: `demo-card-${index % 13}`, rating: [3, 4, 3, 2, 1, 4][index % 6], reviewed_at: new Date(now - (index % 14) * 86_400_000).toISOString() }));
}

export default async function ProfilePage() {
  const hasConfig = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY);
  if (!hasConfig) return <ProfileDashboard isDemo email="visiteur@demo.fr" decks={demoDecks} cards={demoCards} reviews={getDemoReviews()} />;

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return <ProfileDashboard isDemo email="visiteur@demo.fr" decks={demoDecks} cards={demoCards} reviews={getDemoReviews()} />;

  const [{ data: decks }, { data: cards }, { data: reviews }] = await Promise.all([
    supabase.from("decks").select("id,title").order("created_at"),
    supabase.from("cards").select("id,deck_id,answer,reps,state"),
    supabase.from("review_history").select("id,card_id,rating,reviewed_at").order("reviewed_at"),
  ]);

  return <ProfileDashboard isDemo={false} email={user.email ?? ""} decks={decks ?? []} cards={cards ?? []} reviews={reviews ?? []} />;
}
