# OnMangeOu — web public

Dépôt autonome du site public indexable : découverte, fiches restaurants, menus, pages légales.

## Référence

- Spécification maître : `docs/reference/OnMangeOu_Specification_Technique_Maitre.md` (sections 3.3, 6.2, 19, 20)
- Tokens de marque : `docs/reference/onmangeou-tokens.json`
- Logos : `public/brand/`

## Périmètre

Consultation anonyme : accueil, recherche, fiche restaurant, aide, contact, mentions et confidentialité. Rendu serveur pour le référencement. Redirection vers l’application via lien profond placeholder.

Ce dépôt ne contient aucune règle financière faisant autorité. Il consomme `GET /api/v1/discovery/restaurants` et `GET /api/v1/restaurants/{slug}`.

Les commandes, paiements, comptes et favoris appartiennent aux applications mobiles et aux tranches suivantes.

## Commandes

```bash
pnpm install
pnpm typecheck
pnpm lint
pnpm build
pnpm dev
```

API locale attendue : `http://localhost:3000/api/v1` (`API_BASE_URL`).

## Règles impératives

- TypeScript strict, aucun `any`.
- Server Components par défaut. Pas de bibliothèque UI tierce.
- Textes utilisateur uniquement dans `src/i18n/fr-CI.json`.
- Couleurs et espacements issus des tokens. Ne pas inventer de teinte.
- Montants : champ `formatted` de l’API, sinon format entier `12 500 FCFA`. Jamais de flottant.
- Le client `src/lib/api.ts` unwrap `data` et traduit les erreurs RFC 7807.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
