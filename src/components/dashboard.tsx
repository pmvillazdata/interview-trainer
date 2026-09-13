"use client";

import {
  BookOpen,
  BriefcaseBusiness,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Home,
  Layers3,
  LoaderCircle,
  LogOut,
  Menu,
  Plus,
  Search,
  Sparkles,
  Target,
  X,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useMemo, useState } from "react";
import { IFRS_DECK, IFRS_DECK_TITLE } from "@/data/ifrs-deck";
import { createClient } from "@/lib/supabase/client";
import type { AppUser, Deck, StudyCard } from "@/lib/types";

type Grade = "again" | "hard" | "good" | "easy";

const demoDecks = [
  {
    id: "demo-product",
    title: "Product sense",
    subtitle: "Questions produit & stratégie",
    cards: 42,
    due: 8,
    color: "coral",
    icon: Target,
  },
  {
    id: "demo-star",
    title: "Expériences passées",
    subtitle: "Méthode STAR & leadership",
    cards: 31,
    due: 6,
    color: "violet",
    icon: BriefcaseBusiness,
  },
  {
    id: "demo-culture",
    title: "Culture & motivation",
    subtitle: "Valeurs, rôle et entreprise",
    cards: 24,
    due: 4,
    color: "mint",
    icon: Sparkles,
  },
];

const demoCard: StudyCard = {
  id: "demo-card",
  deck_id: "demo-product",
  deckTitle: "Product sense",
  question: "Comment prioriserais-tu les fonctionnalités d’un nouveau produit ?",
  answer: "Clarifier l’objectif, comparer impact et effort, intégrer les signaux utilisateurs, puis expliciter les compromis avec une méthode comme RICE.",
  due_at: new Date().toISOString(),
  reps: 0,
  lapses: 0,
  state: "new",
};

const gradeLabels: Record<Grade, { label: string; interval: string }> = {
  again: { label: "À revoir", interval: "10 min" },
  hard: { label: "Difficile", interval: "2 jours" },
  good: { label: "Bien", interval: "6 jours" },
  easy: { label: "Facile", interval: "12 jours" },
};

function getNextDueDate(grade: Grade) {
  const days = { again: 10 / 1440, hard: 2, good: 6, easy: 12 }[grade];
  return new Date(Date.now() + days * 86_400_000).toISOString();
}

type DashboardProps = {
  initialUser: AppUser | null;
  initialDecks: Deck[];
  initialCards: StudyCard[];
};

export function Dashboard({ initialUser, initialDecks, initialCards }: DashboardProps) {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [answerVisible, setAnswerVisible] = useState(false);
  const [cards, setCards] = useState(initialUser ? initialCards : [demoCard]);
  const [decks, setDecks] = useState<Deck[]>(initialDecks);
  const [reviewed, setReviewed] = useState(0);
  const [showDeckForm, setShowDeckForm] = useState(false);
  const [showCardForm, setShowCardForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const total = cards.length + reviewed;
  const progress = useMemo(() => total ? Math.round((reviewed / total) * 100) : 100, [reviewed, total]);
  const currentCard = cards[0];
  const displayDecks = initialUser ? decks : demoDecks;
  const initials = initialUser?.email.slice(0, 2).toUpperCase() ?? "PM";
  const hasIfrsDeck = decks.some((deck) => deck.title === IFRS_DECK_TITLE);

  async function gradeCard(grade: Grade) {
    if (!currentCard) return;
    const nextDue = getNextDueDate(grade);
    const rating = { again: 1, hard: 2, good: 3, easy: 4 }[grade];

    if (initialUser) {
      setSaving(true);
      const supabase = createClient();
      const { error: cardError } = await supabase.from("cards").update({
        due_at: nextDue,
        reps: currentCard.reps + 1,
        lapses: currentCard.lapses + (grade === "again" ? 1 : 0),
        state: grade === "again" ? "relearning" : "review",
        updated_at: new Date().toISOString(),
      }).eq("id", currentCard.id);
      const { error: historyError } = await supabase.from("review_history").insert({
        user_id: initialUser.id,
        card_id: currentCard.id,
        rating,
        previous_due_at: currentCard.due_at,
        next_due_at: nextDue,
      });
      setSaving(false);
      if (cardError || historyError) {
        setMessage("La révision n’a pas pu être enregistrée.");
        return;
      }
    }

    setCards((value) => value.slice(1));
    setReviewed((value) => Math.min(total, value + 1));
    setAnswerVisible(false);
  }

  async function createDeck(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!initialUser) return router.push("/login");
    const form = new FormData(event.currentTarget);
    setSaving(true);
    const { data, error } = await createClient().from("decks").insert({
      user_id: initialUser.id,
      title: String(form.get("title")),
      description: String(form.get("description") || ""),
      color: String(form.get("color") || "coral"),
    }).select("id,title,description,color").single();
    setSaving(false);
    if (error || !data) return setMessage("Impossible de créer ce paquet.");
    setDecks((value) => [...value, { ...data, cards: 0, due: 0 }]);
    setShowDeckForm(false);
    setMessage("Paquet créé.");
  }

  async function createCard(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!initialUser) return router.push("/login");
    const form = new FormData(event.currentTarget);
    setSaving(true);
    const { data, error } = await createClient().from("cards").insert({
      deck_id: String(form.get("deck")),
      question: String(form.get("question")),
      answer: String(form.get("answer")),
    }).select("id,deck_id,question,answer,due_at,reps,lapses,state").single();
    setSaving(false);
    if (error || !data) return setMessage("Impossible de créer cette carte.");
    const deck = decks.find((item) => item.id === data.deck_id);
    setCards((value) => [...value, { ...data, deckTitle: deck?.title ?? "Sans paquet" }]);
    setDecks((value) => value.map((item) => item.id === data.deck_id ? { ...item, cards: item.cards + 1, due: item.due + 1 } : item));
    setShowCardForm(false);
    setMessage("Carte ajoutée à la session du jour.");
  }

  async function installIfrsDeck() {
    if (!initialUser) return router.push("/login");
    if (hasIfrsDeck) return setMessage("Ce paquet est déjà dans ta bibliothèque.");

    setSaving(true);
    setMessage("");
    const supabase = createClient();
    const { data: deck, error: deckError } = await supabase.from("decks").insert({
      user_id: initialUser.id,
      title: IFRS_DECK.title,
      description: IFRS_DECK.description,
      color: IFRS_DECK.color,
    }).select("id,title,description,color").single();

    if (deckError || !deck) {
      setSaving(false);
      return setMessage("Impossible d’ajouter le paquet IFRS.");
    }

    const { data: newCards, error: cardsError } = await supabase.from("cards").insert(
      IFRS_DECK.cards.map((card) => ({
        deck_id: deck.id,
        question: card.question,
        answer: card.answer,
      })),
    ).select("id,deck_id,question,answer,due_at,reps,lapses,state");

    if (cardsError || !newCards) {
      await supabase.from("decks").delete().eq("id", deck.id);
      setSaving(false);
      return setMessage("Les cartes IFRS n’ont pas pu être ajoutées.");
    }

    setDecks((value) => [...value, { ...deck, cards: newCards.length, due: newCards.length }]);
    setCards((value) => [...value, ...newCards.map((card) => ({ ...card, deckTitle: deck.title }))]);
    setSaving(false);
    setMessage("Le paquet IFRS et ses 50 cartes sont prêts.");
  }

  async function signOut() {
    await createClient().auth.signOut({ scope: "local" });
    router.refresh();
  }

  return (
    <div className="app-shell">
      <aside className={`sidebar ${menuOpen ? "sidebar-open" : ""}`}>
        <div className="brand-row">
          <div className="brand-mark">I</div>
          <div>
            <p className="brand-name">Interview</p>
            <p className="brand-name brand-accent">Trainer</p>
          </div>
          <button className="icon-button close-menu" onClick={() => setMenuOpen(false)} aria-label="Fermer le menu">
            <X size={20} />
          </button>
        </div>

        <nav className="main-nav" aria-label="Navigation principale">
          <a className="nav-item nav-item-active" href="#today">
            <Home size={19} /> Aujourd’hui
          </a>
          <a className="nav-item" href="#decks">
            <Layers3 size={19} /> Mes paquets
          </a>
        </nav>

        <div className="sidebar-spacer" />

        <Link className="profile-card" href={initialUser ? "#account" : "/login"}>
          <div className="avatar">{initials}</div>
          <div>
            <p className="profile-name">{initialUser ? initialUser.email.split("@")[0] : "Mon espace"}</p>
            <p className="profile-state">{initialUser ? "Synchronisé" : "Mode démo"}</p>
          </div>
          <ChevronRight size={18} />
        </Link>
      </aside>

      {menuOpen && <button className="menu-backdrop" onClick={() => setMenuOpen(false)} aria-label="Fermer le menu" />}

      <main className="main-content">
        <header className="topbar">
          <button className="icon-button mobile-menu" onClick={() => setMenuOpen(true)} aria-label="Ouvrir le menu">
            <Menu size={22} />
          </button>
          <div className="mobile-brand"><span>I</span> Interview Trainer</div>
          <div className="search-wrap">
            <Search size={18} />
            <input aria-label="Rechercher" placeholder="Rechercher une carte…" />
            <kbd>⌘ K</kbd>
          </div>
          {initialUser ? <button className="login-link logout-button" onClick={signOut}><LogOut size={15} /> Déconnexion</button> : <Link className="login-link" href="/login">Se connecter</Link>}
        </header>

        <div className="content-wrap">
          <section className="hero" id="today">
            <div>
              <p className="eyebrow">Jeudi 10 septembre</p>
              <h1>Bonjour 👋</h1>
              <p className="hero-copy">Une petite session aujourd’hui, un entretien beaucoup plus serein demain.</p>
            </div>
            <button className="secondary-button" onClick={() => initialUser ? setShowCardForm(true) : router.push("/login")}><Plus size={18} /> Nouvelle carte</button>
          </section>

          <section className="today-grid">
            <article className="review-card">
              <div className="review-head">
                <div>
                  <span className="section-label"><Clock3 size={15} /> Session du jour</span>
                  <h2>{cards.length} carte{cards.length === 1 ? "" : "s"} à réviser</h2>
                </div>
                <div className="progress-ring" style={{ "--progress": `${progress * 3.6}deg` } as React.CSSProperties}>
                  <span>{progress}%</span>
                </div>
              </div>

              {currentCard ? <div className={`flashcard ${answerVisible ? "flashcard-open" : ""}`}>
                <div className="flashcard-meta">
                  <span className="deck-pill">{currentCard.deckTitle}</span>
                  <span>{reviewed + 1} / {total}</span>
                </div>
                <p className="flashcard-kicker">QUESTION</p>
                <h3>{currentCard.question}</h3>

                {answerVisible ? (
                  <div className="answer-panel">
                    <p className="flashcard-kicker">POINTS CLÉS</p>
                    <p>{currentCard.answer}</p>
                  </div>
                ) : (
                  <button className="reveal-button" onClick={() => setAnswerVisible(true)}>
                    Révéler la réponse <span>Espace</span>
                  </button>
                )}
              </div> : <div className="empty-review"><CheckCircle2 /><h3>Session terminée !</h3><p>Tu es à jour. Ajoute une carte ou reviens demain.</p></div>}

              {answerVisible && currentCard && (
                <div className="grade-grid" aria-label="Évaluer la réponse">
                  {(Object.keys(gradeLabels) as Grade[]).map((grade) => (
                    <button key={grade} disabled={saving} className={`grade-button grade-${grade}`} onClick={() => gradeCard(grade)}>
                      <strong>{gradeLabels[grade].label}</strong>
                      <span>{gradeLabels[grade].interval}</span>
                    </button>
                  ))}
                </div>
              )}
            </article>

          </section>

          <section className="decks-section" id="decks">
            <div className="section-heading">
              <div>
                <p className="eyebrow">Ta bibliothèque</p>
                <h2>Continuer un paquet</h2>
              </div>
              <button className="text-button" onClick={() => initialUser ? setShowDeckForm(true) : router.push("/login")}><Plus size={15} /> Nouveau paquet</button>
            </div>

            <div className="deck-grid">
              {displayDecks.map((deck, index) => {
                const Icon = [Target, BriefcaseBusiness, Sparkles][index % 3];
                return (
                  <article className="deck-card" key={deck.title}>
                    <div className={`deck-icon deck-${deck.color}`}><Icon size={21} /></div>
                    <div className="deck-title-row">
                      <h3>{deck.title}</h3>
                      <button className="round-arrow" aria-label={`Ouvrir ${deck.title}`}><ChevronRight size={18} /></button>
                    </div>
                    <p>{"subtitle" in deck ? deck.subtitle : deck.description || "Ton prochain sujet d’entraînement"}</p>
                    <div className="deck-stats">
                      <span><BookOpen size={15} /> {deck.cards} cartes</span>
                      <strong>{deck.due} aujourd’hui</strong>
                    </div>
                  </article>
                );
              })}

              {initialUser && !hasIfrsDeck && (
                <article className="starter-deck-card">
                  <div className="starter-deck-topline">
                    <span>Nouveau paquet</span>
                    <strong>50 cartes</strong>
                  </div>
                  <div className="starter-deck-icon"><BookOpen size={22} /></div>
                  <h3>IFRS &amp; French GAAP</h3>
                  <p>Les différences essentielles pour passer des comptes français aux IFRS et réussir tes entretiens.</p>
                  <button disabled={saving} onClick={installIfrsDeck}>
                    {saving ? <><LoaderCircle className="spin" size={17} /> Ajout en cours…</> : <><Plus size={17} /> Ajouter à mes paquets</>}
                  </button>
                </article>
              )}
            </div>
          </section>
        </div>

        <nav className="mobile-nav" aria-label="Navigation mobile">
          <a className="mobile-nav-active" href="#today"><Home size={20} /><span>Aujourd’hui</span></a>
          <a href="#decks"><Layers3 size={20} /><span>Paquets</span></a>
          <button aria-label="Créer une carte" onClick={() => initialUser ? setShowCardForm(true) : router.push("/login")}><Plus size={22} /></button>
          <a href="#today"><Clock3 size={20} /><span>Réviser</span></a>
          <Link href="/login"><div className="mini-avatar">{initials}</div><span>Compte</span></Link>
        </nav>
      </main>

      {message && <button className="toast" onClick={() => setMessage("")}>{message}</button>}
      {showDeckForm && <div className="modal-backdrop"><form className="modal-card" onSubmit={createDeck}>
        <button type="button" className="modal-close" onClick={() => setShowDeckForm(false)}><X /></button>
        <p className="eyebrow">NOUVEAU PAQUET</p><h2>Quel sujet veux-tu travailler ?</h2>
        <label>Nom<input name="title" required placeholder="Ex. Business case" /></label>
        <label>Description<input name="description" placeholder="Ex. Structures et calcul mental" /></label>
        <label>Couleur<select name="color"><option value="coral">Corail</option><option value="violet">Violet</option><option value="mint">Menthe</option></select></label>
        <button className="modal-submit" disabled={saving}>{saving ? <LoaderCircle className="spin" /> : "Créer le paquet"}</button>
      </form></div>}
      {showCardForm && <div className="modal-backdrop"><form className="modal-card" onSubmit={createCard}>
        <button type="button" className="modal-close" onClick={() => setShowCardForm(false)}><X /></button>
        <p className="eyebrow">NOUVELLE CARTE</p><h2>Ajoute une question d’entretien</h2>
        {decks.length ? <>
          <label>Paquet<select name="deck" required>{decks.map((deck) => <option key={deck.id} value={deck.id}>{deck.title}</option>)}</select></label>
          <label>Question<textarea name="question" required placeholder="La question à laquelle tu veux t’entraîner" /></label>
          <label>Réponse / points clés<textarea name="answer" required placeholder="Les éléments que tu veux retenir" /></label>
          <button className="modal-submit" disabled={saving}>{saving ? <LoaderCircle className="spin" /> : "Ajouter la carte"}</button>
        </> : <div className="empty-form"><p>Commence par créer un paquet pour ranger tes cartes.</p><button type="button" className="modal-submit" onClick={() => { setShowCardForm(false); setShowDeckForm(true); }}>Créer mon premier paquet</button></div>}
      </form></div>}
    </div>
  );
}
