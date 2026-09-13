"use client";

import { ArrowLeft, BookOpen, Check, ChevronDown, LoaderCircle, Plus, Trash2, X } from "lucide-react";
import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { difficultyLabels, encodeQuestionContent, parseQuestionContent, typeLabels, type Difficulty, type QuestionType } from "@/lib/question-content";

type Deck = { id: string; title: string; description: string | null; color: string };
type Card = { id: string; deck_id: string; question: string; answer: string; due_at: string; reps: number; lapses: number; state: string };

export function DeckDetail({ deck, initialCards, readOnly = false }: { deck: Deck; initialCards: Card[]; readOnly?: boolean }) {
  const [cards, setCards] = useState(initialCards);
  const [openCard, setOpenCard] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [type, setType] = useState<QuestionType>("simple");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const counts = useMemo(() => cards.reduce((acc, card) => {
    acc[parseQuestionContent(card.answer).type]++;
    return acc;
  }, { simple: 0, multiple_choice: 0 }), [cards]);

  async function addQuestion(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const options = type === "multiple_choice" ? [0, 1, 2, 3].map(i => String(form.get(`option-${i}`) || "").trim()).filter(Boolean) : [];
    const correctOption = type === "multiple_choice" ? Number(form.get("correctOption")) : null;
    if (type === "multiple_choice" && options.length < 2) return setMessage("Ajoute au moins deux choix.");
    const answer = encodeQuestionContent({ type, difficulty: String(form.get("difficulty")) as Difficulty, answer: String(form.get("answer") || ""), options, correctOption });
    setSaving(true);
    const { data, error } = await createClient().from("cards").insert({ deck_id: deck.id, question: String(form.get("question")), answer }).select("id,deck_id,question,answer,due_at,reps,lapses,state").single();
    setSaving(false);
    if (error || !data) return setMessage("Impossible d’ajouter cette question.");
    setCards(value => [...value, data]);
    setShowForm(false);
    setType("simple");
    setMessage("Question ajoutée.");
  }

  async function removeCard(id: string) {
    if (!window.confirm("Supprimer définitivement cette question ?")) return;
    setSaving(true);
    const { error } = await createClient().from("cards").delete().eq("id", id);
    setSaving(false);
    if (error) return setMessage("Impossible de supprimer cette question.");
    setCards(value => value.filter(card => card.id !== id));
  }

  return <main className="deck-page">
    <header className="deck-detail-header">
      <Link href="/#decks"><ArrowLeft size={17} /> Mes paquets</Link>
      {readOnly ? <span className="preview-readonly">Mode visite · lecture seule</span> : <button onClick={() => setShowForm(true)}><Plus size={17} /> Ajouter une question</button>}
    </header>
    <div className="deck-detail-content">
      <section className="deck-detail-title">
        <div><BookOpen /></div><p className="eyebrow">Paquet d’entraînement</p><h1>{deck.title}</h1><p>{deck.description}</p>
      </section>
      <section className="deck-counters"><div><b>{cards.length}</b><span>Questions</span></div><div><b>{counts.simple}</b><span>À révéler</span></div><div><b>{counts.multiple_choice}</b><span>Choix multiples</span></div></section>
      <div className="deck-list-heading"><div><p className="eyebrow">Contenu du paquet</p><h2>Toutes les questions</h2></div><span>Clique pour afficher la réponse</span></div>
      <section className="deck-question-list">
        {cards.map((card, index) => {
          const content = parseQuestionContent(card.answer);
          const isOpen = openCard === card.id;
          return <article className={isOpen ? "open" : ""} key={card.id}>
            <button className="deck-question" onClick={() => setOpenCard(isOpen ? null : card.id)}><i>{String(index + 1).padStart(2, "0")}</i><span><b>{card.question}</b><small><em>{typeLabels[content.type]}</em><em className={`level-${content.difficulty}`}>{difficultyLabels[content.difficulty]}</em></small></span><ChevronDown /></button>
            {isOpen && <div className="deck-answer">
              {content.type === "multiple_choice" && <div className="deck-options">{content.options.map((option, i) => <span className={i === content.correctOption ? "correct" : ""} key={option}>{i === content.correctOption && <Check size={13} />}{option}</span>)}</div>}
              {content.answer && <p><b>Réponse</b>{content.answer}</p>}
              {!readOnly && <button onClick={() => removeCard(card.id)}><Trash2 size={14} /> Supprimer</button>}
            </div>}
          </article>;
        })}
        {!cards.length && <div className="deck-empty"><BookOpen /><h3>Ce paquet est vide</h3><p>Ajoute ta première question pour commencer.</p></div>}
      </section>
    </div>
    {message && <button className="toast" onClick={() => setMessage("")}>{message}</button>}
    {showForm && !readOnly && <div className="modal-backdrop"><form className="modal-card" onSubmit={addQuestion}>
      <button type="button" className="modal-close" onClick={() => setShowForm(false)}><X /></button><p className="eyebrow">NOUVELLE QUESTION</p><h2>Choisis son format</h2>
      <div className="question-type-picker"><button type="button" className={type === "simple" ? "selected" : ""} onClick={() => setType("simple")}><BookOpen /><span><b>Réponse à révéler</b><small>Question puis réponse libre</small></span></button><button type="button" className={type === "multiple_choice" ? "selected" : ""} onClick={() => setType("multiple_choice")}><Check /><span><b>Choix multiple</b><small>Plusieurs choix, une réponse</small></span></button></div>
      <label>Difficulté<select name="difficulty" defaultValue="intermediate"><option value="beginner">Débutant</option><option value="intermediate">Intermédiaire</option><option value="advanced">Avancé</option></select></label>
      <label>Question<textarea name="question" required placeholder="Écris la question…" /></label>
      {type === "multiple_choice" && <div className="choice-fields">{[0,1,2,3].map(i => <label key={i}>Choix {i + 1}<input name={`option-${i}`} required={i < 2} /></label>)}<label>Bonne réponse<select name="correctOption"><option value="0">Choix 1</option><option value="1">Choix 2</option><option value="2">Choix 3</option><option value="3">Choix 4</option></select></label></div>}
      <label>{type === "simple" ? "Réponse" : "Explication (facultative)"}<textarea name="answer" required={type === "simple"} placeholder="Les points clés à retenir…" /></label>
      <button className="modal-submit" disabled={saving}>{saving ? <LoaderCircle className="spin" /> : "Ajouter au paquet"}</button>
    </form></div>}
  </main>;
}
