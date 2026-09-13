import { Dashboard } from "@/components/dashboard";
import { isPreviewVisitor } from "@/data/preview-data";
import { createClient } from "@/lib/supabase/server";
import type { Deck, StudyCard } from "@/lib/types";

export default async function Home() {
  let decks: Deck[] = [];
  let cards: StudyCard[] = [];
  let initialUser = null;
  const visitorMode = isPreviewVisitor();

  if (!visitorMode) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    initialUser = user ? { id: user.id, email: user.email ?? "" } : null;
    if (user) {
    const [{ data: deckRows }, { data: cardRows }] = await Promise.all([
      supabase.from("decks").select("id,title,description,color,cards(id,due_at)").order("created_at"),
      supabase.from("cards").select("id,deck_id,question,answer,due_at,reps,lapses,state,decks(title)").lte("due_at", new Date().toISOString()).order("due_at").limit(50),
    ]);

    decks = (deckRows ?? []).map((deck) => ({
      id: deck.id,
      title: deck.title,
      description: deck.description,
      color: deck.color,
      cards: deck.cards.length,
      due: (cardRows ?? []).filter((card) => card.deck_id === deck.id).length,
    }));
    cards = (cardRows ?? []).map((card) => {
      const relatedDeck = card.decks as unknown as { title: string } | null;
      return {
        id: card.id,
        deck_id: card.deck_id,
        question: card.question,
        answer: card.answer,
        due_at: card.due_at,
        reps: card.reps,
        lapses: card.lapses,
        state: card.state,
        deckTitle: relatedDeck?.title ?? "Sans paquet",
      };
    });
    }
  }

  const today = new Intl.DateTimeFormat("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Europe/Paris",
  }).format(new Date());

  return <Dashboard today={today} isVisitor={visitorMode} initialUser={initialUser} initialDecks={decks} initialCards={cards} />;
}
