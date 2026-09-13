import { notFound, redirect } from "next/navigation";
import { DeckDetail } from "@/components/deck-detail";
import { createClient } from "@/lib/supabase/server";

export default async function DeckPage({ params }: PageProps<"/decks/[id]">) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [{ data: deck }, { data: cards }] = await Promise.all([
    supabase.from("decks").select("id,title,description,color").eq("id", id).single(),
    supabase.from("cards").select("id,deck_id,question,answer,due_at,reps,lapses,state").eq("deck_id", id).order("created_at"),
  ]);
  if (!deck) notFound();
  return <DeckDetail deck={deck} initialCards={cards ?? []} />;
}
