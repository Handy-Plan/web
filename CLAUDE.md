# HandyPlan web

Next.js 16 + React 19 + Tailwind v4 + next-intl (en/de).

## UI work
Every screen follows the v2 "night-blue" design system in
`design-system/handyplan/MASTER.md` (colour tokens, Geist type, radii, the
night-blue stage, motion patterns, copy rules, pre-flight checklist). Before
building or changing UI:
- load the skills `design-taste-frontend`, `apple-design`, `ui-ux-pro-max`;
- read MASTER.md, plus `../Vault/06 Tech/UI Design System.md` for component
  APIs, CSS motion utilities and known gotchas;
- reuse the reference components it lists instead of inventing new styles.

## Checks
- `npx tsc --noEmit` and `npx eslint` must be clean.
- `npm run build` before merging to `main` (Netlify builds this repo; see `netlify.toml`).

## Git
Work on a `feat/*` branch, merge into `main` with `--no-ff`, delete the branch
after merging.
