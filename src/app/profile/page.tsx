import { redirect } from "next/navigation";
import { ProfileDashboard } from "@/components/profile-dashboard";
import { createClient } from "@/lib/supabase/server";

export default async function ProfilePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [{ data: decks }, { data: cards }, { data: reviews }] = await Promise.all([
    supabase.from("decks").select("id,title").order("created_at"),
    supabase.from("cards").select("id,deck_id,answer,reps,state"),
    supabase.from("review_history").select("id,card_id,rating,reviewed_at").order("reviewed_at"),
  ]);

  return <ProfileDashboard email={user.email ?? ""} decks={decks ?? []} cards={cards ?? []} reviews={reviews ?? []} />;
}
