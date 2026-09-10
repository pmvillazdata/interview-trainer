# Interview Trainer

Une web-app personnelle de révision inspirée d’Anki pour préparer des entretiens. Elle est pensée pour le téléphone et l’ordinateur, avec un compte unique et une progression synchronisée.

## Vision

Transformer les questions d’entretien en cartes mémorisables grâce à la répétition espacée, avec des sessions courtes et un suivi clair de la progression.

## Première version

- Créer et organiser des cartes par thème et par poste
- Réviser avec quatre niveaux : À revoir, Difficile, Bien, Facile
- Planifier automatiquement les prochaines révisions
- Suivre la progression et les sujets à renforcer
- Conserver les données utilisateur de façon sécurisée

## Parcours principal

1. L’utilisateur crée un paquet pour un poste ou une entreprise.
2. Il ajoute des questions et leurs éléments de réponse.
3. Il lance une session quotidienne.
4. Il tente de répondre avant de révéler la fiche.
5. Son évaluation planifie la prochaine révision.

## Stack

- Next.js, React et TypeScript
- Tailwind CSS et composants personnalisés
- Supabase Auth + PostgreSQL
- Vercel pour l’hébergement

## Lancer le projet

```bash
pnpm install
pnpm dev
```

Ouvrir ensuite `http://localhost:3000`.

## Brancher Supabase

1. Créer un projet Supabase.
2. Exécuter la migration dans `supabase/migrations` depuis le SQL Editor.
3. Copier `.env.example` vers `.env.local`.
4. Ajouter l’URL du projet et sa clé publique anonyme.
5. Ajouter l’URL locale et la future URL Vercel aux URL de redirection Auth.

Sans ces variables, l’application reste volontairement en mode démo.
