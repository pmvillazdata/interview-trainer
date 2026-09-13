"use client";

import { ArrowLeft, BarChart3, BookOpen, CalendarDays, CheckCircle2, Layers3, Target } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { difficultyLabels, parseQuestionContent, typeLabels } from "@/lib/question-content";

type Deck = { id: string; title: string };
type Card = { id: string; deck_id: string; answer: string; reps: number; state: string };
type Review = { id: string; card_id: string; rating: number; reviewed_at: string };
type Period = "7" | "30" | "all";

const resultLabels = ["À revoir", "Difficile", "Bien", "Facile"];
const resultColors = ["#d87368", "#d9a441", "#2f9d78", "#3975c6"];

export function ProfileDashboard({ email, decks, cards, reviews, isDemo }: { email: string; decks: Deck[]; cards: Card[]; reviews: Review[]; isDemo: boolean }) {
  const [period, setPeriod] = useState<Period>("30");
  const [deckId, setDeckId] = useState("all");
  const [now] = useState(() => Date.now());

  const stats = useMemo(() => {
    const cardMap = new Map(cards.map(card => [card.id, card]));
    const selectedCards = cards.filter(card => deckId === "all" || card.deck_id === deckId);
    const cutoff = period === "all" ? 0 : now - Number(period) * 86_400_000;
    const filtered = reviews.filter(review => {
      const card = cardMap.get(review.card_id);
      return card && (deckId === "all" || card.deck_id === deckId) && new Date(review.reviewed_at).getTime() >= cutoff;
    });
    const playedIds = new Set(filtered.map(review => review.card_id));
    const everPlayed = new Set(reviews.filter(review => {
      const card = cardMap.get(review.card_id);
      return card && (deckId === "all" || card.deck_id === deckId);
    }).map(review => review.card_id));
    const results = [1, 2, 3, 4].map(rating => filtered.filter(review => review.rating === rating).length);
    const difficulty = ["beginner", "intermediate", "advanced"].map(level => filtered.filter(review => parseQuestionContent(cardMap.get(review.card_id)?.answer ?? "").difficulty === level).length);
    const types = ["simple", "multiple_choice"].map(type => filtered.filter(review => parseQuestionContent(cardMap.get(review.card_id)?.answer ?? "").type === type).length);
    const days = Array.from({ length: 14 }, (_, index) => {
      const date = new Date(now); date.setHours(0, 0, 0, 0); date.setDate(date.getDate() - (13 - index));
      const next = new Date(date); next.setDate(next.getDate() + 1);
      return { label: date.toLocaleDateString("fr-FR", { weekday: "short" }).slice(0, 1), value: filtered.filter(review => { const time = new Date(review.reviewed_at).getTime(); return time >= date.getTime() && time < next.getTime(); }).length };
    });
    const success = filtered.length ? Math.round(((results[2] + results[3]) / filtered.length) * 100) : 0;
    return { selectedCards, filtered, played: playedIds.size, unplayed: selectedCards.length - everPlayed.size, results, difficulty, types, days, success };
  }, [cards, reviews, deckId, period, now]);

  const maxDay = Math.max(...stats.days.map(day => day.value), 1);
  const totalResults = Math.max(stats.filtered.length, 1);
  const initials = email.slice(0, 2).toUpperCase();

  return <main className="profile-page">
    <header className="profile-header"><Link href="/"><ArrowLeft size={17} /> Aujourd’hui</Link><span>{isDemo ? "Aperçu en mode visite" : "Statistiques synchronisées"}</span></header>
    <div className="profile-content">
      <section className="profile-intro"><div className="profile-big-avatar">{initials}</div><div><p className="eyebrow">{isDemo ? "Mode visite" : "Mon profil"}</p><h1>{isDemo ? "Aperçu du profil" : email.split("@")[0]}</h1><p>{isDemo ? "Données de démonstration — aucune donnée personnelle affichée" : email}</p></div></section>
      <section className="profile-filters"><label><CalendarDays size={15} /> Période<select value={period} onChange={event => setPeriod(event.target.value as Period)}><option value="7">7 derniers jours</option><option value="30">30 derniers jours</option><option value="all">Depuis le début</option></select></label><label><Layers3 size={15} /> Paquet<select value={deckId} onChange={event => setDeckId(event.target.value)}><option value="all">Tous les paquets</option>{decks.map(deck => <option value={deck.id} key={deck.id}>{deck.title}</option>)}</select></label></section>
      <section className="profile-kpis">
        <article><span><BookOpen /></span><div><p>Cartes jouées</p><b>{stats.played}</b><small>sur la période</small></div></article>
        <article><span><Layers3 /></span><div><p>Non jouées</p><b>{stats.unplayed}</b><small>dans ta bibliothèque</small></div></article>
        <article><span><Target /></span><div><p>Taux de réussite</p><b>{stats.success}%</b><small>Bien ou Facile</small></div></article>
        <article><span><CheckCircle2 /></span><div><p>Réponses données</p><b>{stats.filtered.length}</b><small>toutes tentatives</small></div></article>
      </section>
      <section className="profile-grid">
        <article className="analytics-card activity-card"><div className="analytics-heading"><div><p className="eyebrow">Régularité</p><h2>Activité récente</h2></div><BarChart3 /></div><div className="activity-chart">{stats.days.map((day, index) => <div key={index}><i style={{ height: `${Math.max(5, day.value / maxDay * 100)}%` }} title={`${day.value} réponses`} /><span>{day.label}</span></div>)}</div></article>
        <article className="analytics-card"><div className="analytics-heading"><div><p className="eyebrow">Résultats</p><h2>Qualité des réponses</h2></div><div className="success-donut" style={{ background: `conic-gradient(#1282a2 ${stats.success * 3.6}deg, #edf0f3 0)` }}><span>{stats.success}%</span></div></div><div className="result-list">{stats.results.map((value, index) => <div key={index}><span><i style={{ background: resultColors[index] }} />{resultLabels[index]}</span><div><i style={{ width: `${value / totalResults * 100}%`, background: resultColors[index] }} /></div><b>{value}</b></div>)}</div></article>
        <article className="analytics-card"><div className="analytics-heading"><div><p className="eyebrow">Niveau</p><h2>Par difficulté</h2></div></div><div className="horizontal-bars">{stats.difficulty.map((value, index) => <div key={index}><span>{difficultyLabels[["beginner", "intermediate", "advanced"][index] as keyof typeof difficultyLabels]}</span><div><i style={{ width: `${value / totalResults * 100}%` }} /></div><b>{value}</b></div>)}</div></article>
        <article className="analytics-card"><div className="analytics-heading"><div><p className="eyebrow">Formats</p><h2>Par type de question</h2></div></div><div className="format-breakdown">{stats.types.map((value, index) => <div key={index}><span className={index ? "format-qcm" : "format-simple"}>{Math.round(value / totalResults * 100)}%</span><div><b>{typeLabels[index ? "multiple_choice" : "simple"]}</b><small>{value} réponse{value === 1 ? "" : "s"}</small></div></div>)}</div></article>
      </section>
      {!stats.filtered.length && <div className="profile-empty">Les graphiques se rempliront dès que tu auras répondu à quelques cartes avec ces filtres.</div>}
    </div>
  </main>;
}
