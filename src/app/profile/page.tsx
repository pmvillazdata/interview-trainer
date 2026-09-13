import { ProfileDashboard } from "@/components/profile-dashboard";
import { getPreviewReviews, isPreviewVisitor, previewCards, previewDecks } from "@/data/preview-data";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function ProfilePage() {
  if (isPreviewVisitor()) return <ProfileDashboard isDemo email="qa@interview-trainer.test" decks={previewDecks} cards={previewCards} reviews={getPreviewReviews()} />;

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [{ data: decks }, { data: cards }, { data: reviews }] = await Promise.all([
    supabase.from("decks").select("id,title").order("created_at"),
    supabase.from("cards").select("id,deck_id,answer,reps,state"),
    supabase.from("review_history").select("id,card_id,rating,reviewed_at").order("reviewed_at"),
  ]);

  return <ProfileDashboard isDemo={false} email={user.email ?? ""} decks={decks ?? []} cards={cards ?? []} reviews={reviews ?? []} />;
}
