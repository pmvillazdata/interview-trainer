"use client";

import {
  BarChart3,
  BookOpen,
  BriefcaseBusiness,
  ChevronRight,
  CircleHelp,
  Clock3,
  Home,
  Layers3,
  Menu,
  Plus,
  Search,
  Settings,
  Sparkles,
  Target,
  X,
} from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

type Grade = "again" | "hard" | "good" | "easy";

const decks = [
  {
    title: "Product sense",
    subtitle: "Questions produit & stratégie",
    cards: 42,
    due: 8,
    color: "coral",
    icon: Target,
  },
  {
    title: "Expériences passées",
    subtitle: "Méthode STAR & leadership",
    cards: 31,
    due: 6,
    color: "violet",
    icon: BriefcaseBusiness,
  },
  {
    title: "Culture & motivation",
    subtitle: "Valeurs, rôle et entreprise",
    cards: 24,
    due: 4,
    color: "mint",
    icon: Sparkles,
  },
];

const gradeLabels: Record<Grade, { label: string; interval: string }> = {
  again: { label: "À revoir", interval: "10 min" },
  hard: { label: "Difficile", interval: "2 jours" },
  good: { label: "Bien", interval: "6 jours" },
  easy: { label: "Facile", interval: "12 jours" },
};

export function Dashboard() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [answerVisible, setAnswerVisible] = useState(false);
  const [reviewed, setReviewed] = useState(7);
  const total = 18;
  const progress = useMemo(() => Math.round((reviewed / total) * 100), [reviewed]);

  function gradeCard() {
    setReviewed((value) => Math.min(total, value + 1));
    setAnswerVisible(false);
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
          <a className="nav-item" href="#progress">
            <BarChart3 size={19} /> Progression
          </a>
        </nav>

        <div className="sidebar-spacer" />

        <div className="sidebar-card">
          <div className="sidebar-card-icon"><Sparkles size={18} /></div>
          <p className="sidebar-card-title">Objectif de la semaine</p>
          <p className="sidebar-card-value">5 jours sur 7</p>
          <div className="mini-progress"><span style={{ width: "71%" }} /></div>
        </div>

        <nav className="secondary-nav" aria-label="Réglages">
          <a className="nav-item" href="#help"><CircleHelp size={18} /> Aide</a>
          <a className="nav-item" href="#settings"><Settings size={18} /> Réglages</a>
        </nav>

        <Link className="profile-card" href="/login">
          <div className="avatar">PM</div>
          <div>
            <p className="profile-name">Mon espace</p>
            <p className="profile-state">Mode démo</p>
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
          <Link className="login-link" href="/login">Se connecter</Link>
        </header>

        <div className="content-wrap">
          <section className="hero" id="today">
            <div>
              <p className="eyebrow">Jeudi 10 septembre</p>
              <h1>Bonjour 👋</h1>
              <p className="hero-copy">Une petite session aujourd’hui, un entretien beaucoup plus serein demain.</p>
            </div>
            <button className="secondary-button"><Plus size={18} /> Nouvelle carte</button>
          </section>

          <section className="today-grid">
            <article className="review-card">
              <div className="review-head">
                <div>
                  <span className="section-label"><Clock3 size={15} /> Session du jour</span>
                  <h2>{total - reviewed} cartes à réviser</h2>
                </div>
                <div className="progress-ring" style={{ "--progress": `${progress * 3.6}deg` } as React.CSSProperties}>
                  <span>{progress}%</span>
                </div>
              </div>

              <div className={`flashcard ${answerVisible ? "flashcard-open" : ""}`}>
                <div className="flashcard-meta">
                  <span className="deck-pill">Product sense</span>
                  <span>{Math.min(reviewed + 1, total)} / {total}</span>
                </div>
                <p className="flashcard-kicker">QUESTION</p>
                <h3>Comment prioriserais-tu les fonctionnalités d’un nouveau produit ?</h3>

                {answerVisible ? (
                  <div className="answer-panel">
                    <p className="flashcard-kicker">POINTS CLÉS</p>
                    <p>Clarifier l’objectif, comparer impact et effort, intégrer les signaux utilisateurs, puis expliciter les compromis avec une méthode comme RICE.</p>
                  </div>
                ) : (
                  <button className="reveal-button" onClick={() => setAnswerVisible(true)}>
                    Révéler la réponse <span>Espace</span>
                  </button>
                )}
              </div>

              {answerVisible && (
                <div className="grade-grid" aria-label="Évaluer la réponse">
                  {(Object.keys(gradeLabels) as Grade[]).map((grade) => (
                    <button key={grade} className={`grade-button grade-${grade}`} onClick={gradeCard}>
                      <strong>{gradeLabels[grade].label}</strong>
                      <span>{gradeLabels[grade].interval}</span>
                    </button>
                  ))}
                </div>
              )}
            </article>

            <aside className="streak-card" id="progress">
              <div className="streak-top">
                <div className="flame">🔥</div>
                <div><strong>7 jours</strong><span>Série en cours</span></div>
              </div>
              <div className="week-row">
                {["L", "M", "M", "J", "V", "S", "D"].map((day, index) => (
                  <div key={`${day}-${index}`} className="week-day">
                    <span>{day}</span>
                    <i className={index < 4 ? "day-done" : index === 4 ? "day-today" : ""}>{index < 4 ? "✓" : ""}</i>
                  </div>
                ))}
              </div>
              <div className="streak-divider" />
              <p className="streak-note"><span>+12%</span> de maîtrise cette semaine</p>
            </aside>
          </section>

          <section className="decks-section" id="decks">
            <div className="section-heading">
              <div>
                <p className="eyebrow">Ta bibliothèque</p>
                <h2>Continuer un paquet</h2>
              </div>
              <button className="text-button">Voir tout <ChevronRight size={17} /></button>
            </div>

            <div className="deck-grid">
              {decks.map((deck) => {
                const Icon = deck.icon;
                return (
                  <article className="deck-card" key={deck.title}>
                    <div className={`deck-icon deck-${deck.color}`}><Icon size={21} /></div>
                    <div className="deck-title-row">
                      <h3>{deck.title}</h3>
                      <button className="round-arrow" aria-label={`Ouvrir ${deck.title}`}><ChevronRight size={18} /></button>
                    </div>
                    <p>{deck.subtitle}</p>
                    <div className="deck-stats">
                      <span><BookOpen size={15} /> {deck.cards} cartes</span>
                      <strong>{deck.due} aujourd’hui</strong>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        </div>

        <nav className="mobile-nav" aria-label="Navigation mobile">
          <a className="mobile-nav-active" href="#today"><Home size={20} /><span>Aujourd’hui</span></a>
          <a href="#decks"><Layers3 size={20} /><span>Paquets</span></a>
          <button aria-label="Créer une carte"><Plus size={22} /></button>
          <a href="#progress"><BarChart3 size={20} /><span>Progression</span></a>
          <Link href="/login"><div className="mini-avatar">PM</div><span>Compte</span></Link>
        </nav>
      </main>
    </div>
  );
}
