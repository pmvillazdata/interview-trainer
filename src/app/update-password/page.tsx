"use client";

import { CheckCircle2, LoaderCircle, LockKeyhole } from "lucide-react";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function UpdatePasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    if (password !== confirmation) return setError("Les deux mots de passe ne correspondent pas.");

    setLoading(true);
    const { error: authError } = await createClient().auth.updateUser({ password });
    setLoading(false);
    if (authError) return setError("Impossible d’enregistrer ce mot de passe. Demande un nouvel email de récupération.");
    setSaved(true);
    window.setTimeout(() => {
      router.replace("/");
      router.refresh();
    }, 1200);
  }

  return (
    <main className="auth-page">
      <section className="auth-card">
        <div className="auth-brand"><span>I</span> Interview Trainer</div>
        {saved ? (
          <div className="auth-success"><CheckCircle2 size={42} /><h1>Mot de passe enregistré.</h1><p>Ton espace va s’ouvrir automatiquement.</p></div>
        ) : (
          <>
            <p className="eyebrow">SÉCURITÉ DU COMPTE</p>
            <h1>Choisis ton mot de passe.</h1>
            <p className="auth-copy">Safari peut générer et enregistrer un mot de passe fort dans l’app Mots de passe.</p>
            <form onSubmit={handleSubmit} className="auth-form">
              <label htmlFor="new-password">Nouveau mot de passe</label>
              <div className="auth-field"><LockKeyhole size={18} /><input id="new-password" name="new-password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} minLength={8} autoComplete="new-password" required /></div>
              <label htmlFor="confirm-password">Confirmer le mot de passe</label>
              <div className="auth-field"><LockKeyhole size={18} /><input id="confirm-password" name="confirm-password" type="password" value={confirmation} onChange={(event) => setConfirmation(event.target.value)} minLength={8} autoComplete="new-password" required /></div>
              <button type="submit" disabled={loading}>{loading ? <LoaderCircle className="spin" size={19} /> : "Enregistrer mon mot de passe"}</button>
              {error && <p className="form-error" role="alert">{error}</p>}
            </form>
          </>
        )}
      </section>
    </main>
  );
}
