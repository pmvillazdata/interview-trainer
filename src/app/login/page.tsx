"use client";

import { ArrowLeft, CheckCircle2, LoaderCircle, LockKeyhole, Mail, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient, hasSupabaseConfig } from "@/lib/supabase/client";

type AuthMode = "login" | "signup" | "forgot";

const authMessages: Record<string, string> = {
  invalid_credentials: "Email ou mot de passe incorrect.",
  email_not_confirmed: "Confirme d’abord ton adresse depuis l’email reçu.",
  over_email_send_rate_limit: "Trop d’emails ont été demandés. Réessaie dans environ une heure.",
  over_request_rate_limit: "Trop de tentatives rapprochées. Patiente quelques minutes.",
  user_already_exists: "Un compte existe déjà avec cette adresse. Connecte-toi ou crée ton mot de passe.",
};

function friendlyError(code?: string) {
  return (code && authMessages[code]) || "La connexion a échoué. Vérifie tes informations et réessaie.";
}

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<AuthMode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const configured = hasSupabaseConfig();

  function selectMode(nextMode: AuthMode) {
    setMode(nextMode);
    setError("");
    setSent(false);
    setPassword("");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!configured) return;

    setLoading(true);
    setError("");
    const supabase = createClient();

    if (mode === "forgot") {
      const callback = new URL("/auth/callback", window.location.origin);
      callback.searchParams.set("next", "/update-password");
      const { error: authError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: callback.toString(),
      });
      setLoading(false);
      if (authError) return setError(friendlyError(authError.code));
      return setSent(true);
    }

    if (mode === "signup") {
      const { data, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
      });
      setLoading(false);
      if (authError) return setError(friendlyError(authError.code));
      if (data.session) {
        router.replace("/");
        router.refresh();
        return;
      }
      return setSent(true);
    }

    const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (authError) return setError(friendlyError(authError.code));
    router.replace("/");
    router.refresh();
  }

  const title = mode === "signup" ? "Crée ton espace." : mode === "forgot" ? "Crée un nouveau mot de passe." : "Retrouve tes révisions partout.";
  const successTitle = mode === "forgot" ? "Vérifie tes emails" : "Confirme ton adresse";
  const successCopy = mode === "forgot"
    ? "Ouvre le dernier email reçu pour choisir ton nouveau mot de passe."
    : "Ouvre le dernier email reçu pour confirmer ton compte, puis connecte-toi.";

  return (
    <main className="auth-page">
      <Link href="/" className="back-link"><ArrowLeft size={18} /> Retour</Link>
      <section className="auth-card">
        <div className="auth-brand"><span>I</span> Interview Trainer</div>
        {sent ? (
          <div className="auth-success">
            <CheckCircle2 size={42} />
            <h1>{successTitle}</h1>
            <p>{successCopy}<br /><strong>{email}</strong></p>
            <button className="auth-text-button" type="button" onClick={() => selectMode("login")}>Retour à la connexion</button>
          </div>
        ) : (
          <>
            <p className="eyebrow">TON ESPACE PERSONNEL</p>
            <h1>{title}</h1>
            <p className="auth-copy">
              {mode === "login" && "Ta session reste active sur cet appareil. Safari peut enregistrer ton mot de passe pour les prochaines connexions."}
              {mode === "signup" && "Choisis un mot de passe unique. Safari pourra le générer et le conserver pour toi."}
              {mode === "forgot" && "Pour ton compte existant, utilise cette option une seule fois afin de définir un mot de passe."}
            </p>
            <form onSubmit={handleSubmit} className="auth-form">
              <label htmlFor="email">Adresse email</label>
              <div className="auth-field"><Mail size={18} /><input id="email" name="email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="toi@exemple.com" autoComplete="email" required /></div>
              {mode !== "forgot" && (
                <>
                  <label htmlFor="password">Mot de passe</label>
                  <div className="auth-field"><LockKeyhole size={18} /><input id="password" name="password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="8 caractères minimum" minLength={8} autoComplete={mode === "signup" ? "new-password" : "current-password"} required /></div>
                </>
              )}
              <button type="submit" disabled={!configured || loading}>
                {loading ? <LoaderCircle className="spin" size={19} /> : mode === "signup" ? "Créer mon compte" : mode === "forgot" ? "Recevoir l’email de récupération" : "Se connecter"}
              </button>
              {error && <p className="form-error" role="alert">{error}</p>}
            </form>
            <div className="auth-options">
              {mode === "login" ? (
                <><button type="button" onClick={() => selectMode("forgot")}>Mot de passe oublié ou à créer</button><button type="button" onClick={() => selectMode("signup")}>Créer un compte</button></>
              ) : (
                <button type="button" onClick={() => selectMode("login")}>J’ai déjà un compte</button>
              )}
            </div>
            {!configured && (
              <div className="setup-note"><ShieldCheck size={19} /><p><strong>Mode démo actif.</strong><br />La connexion sera disponible dès que la base Supabase sera reliée.</p></div>
            )}
          </>
        )}
      </section>
    </main>
  );
}
