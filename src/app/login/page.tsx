"use client";

import { ArrowLeft, CheckCircle2, LoaderCircle, Mail, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { FormEvent, useState } from "react";
import { createClient, hasSupabaseConfig } from "@/lib/supabase/client";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const configured = hasSupabaseConfig();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!configured) return;

    setLoading(true);
    setError("");

    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
    });

    setLoading(false);
    if (authError) {
      setError("Impossible d’envoyer le lien. Réessaie dans un instant.");
      return;
    }
    setSent(true);
  }

  return (
    <main className="auth-page">
      <Link href="/" className="back-link"><ArrowLeft size={18} /> Retour</Link>
      <section className="auth-card">
        <div className="auth-brand"><span>I</span> Interview Trainer</div>
        {sent ? (
          <div className="auth-success">
            <CheckCircle2 size={42} />
            <h1>Regarde tes emails</h1>
            <p>Nous avons envoyé un lien de connexion à <strong>{email}</strong>.</p>
          </div>
        ) : (
          <>
            <p className="eyebrow">TON ESPACE PERSONNEL</p>
            <h1>Retrouve tes révisions partout.</h1>
            <p className="auth-copy">Un seul compte pour garder tes cartes, ton historique et ta progression sur ton téléphone et tes ordinateurs. Aucun mot de passe à retenir.</p>
            <form onSubmit={handleSubmit} className="auth-form">
              <label htmlFor="email">Adresse email</label>
              <div className="email-field"><Mail size={18} /><input id="email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="toi@exemple.com" required /></div>
              <button type="submit" disabled={!configured || loading}>
                {loading ? <LoaderCircle className="spin" size={19} /> : "Recevoir mon lien de connexion"}
              </button>
              {error && <p className="form-error">{error}</p>}
            </form>
            {!configured && (
              <div className="setup-note"><ShieldCheck size={19} /><p><strong>Mode démo actif.</strong><br />La connexion sera disponible dès que la base Supabase sera reliée.</p></div>
            )}
          </>
        )}
      </section>
    </main>
  );
}
