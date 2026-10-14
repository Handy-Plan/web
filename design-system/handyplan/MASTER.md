# HandyPlan Design System (v2, "night-blue")

> Source of truth for every HandyPlan screen: landing, auth, onboarding,
> dashboard. Follow it for any new UI. Page-specific overrides may live in
> `design-system/handyplan/pages/<page>.md`; if one exists, it wins.
>
> Skills: load `design-taste-frontend`, `apple-design` and `ui-ux-pro-max`
> before UI work. Long-form guide (component APIs, motion utilities, the
> rules we took from each skill, gotchas): `Vault/06 Tech/UI Design System.md`.
>
> Reference implementations (copy patterns from these, don't reinvent):
> landing `components/sections/*`, auth `components/auth/*`, onboarding
> `components/onboarding/*`, dashboard `components/dashboard/*`.

---

## 1. Design read

Product for German trade businesses (Handwerker): trust-first, calm, but
premium and alive. Apple product-page polish over B2B template. One brand
accent (blue), a night-blue "stage" for showcase moments, everything else
quiet neutrals. Motion explains the product (call → text → job card →
booked); it never decorates for its own sake.

## 2. Colour

All colours are tokens in `app/globals.css` (`@theme` + `.dark`). Never hard-
code hex in components except inside the night-blue stage (see below).

| Token | Use |
|---|---|
| `primary` `#0369a1` (dark `#1577ad`) | The ONE accent: active states, links, progress, icons on soft tiles |
| `primary-soft` | Tinted icon tiles, hover washes |
| `ink` / `graphite` / `slate` / `muted` | Text: headings / strong body / body / hints |
| `line`, `cloud`, `mist`, `fog` | Borders, hover fills, section tints |
| `canvas`, `surface`, `surface-2` | Page bg, cards, inset/input bg |
| `success` / `warning` / `danger` | Real state only (booked, urgency, missed/error) |

- **Night-blue stage**: `bg-[#06121f]` panel with two radial glows
  (`rgba(3,105,161,.55)` top, `rgba(56,189,248,.2)` bottom) and optional
  perspective floor (`.hp-floor` with `[--color-primary:#38bdf8]`). Used for
  showcase surfaces: auth brand panel, onboarding preview, landing CTA,
  dashboard hero card. It stays dark in BOTH themes. Text on it: white,
  `white/65` body, `sky-300` accents, glass chips `bg-white/[0.08] ring-white/15`.
- **Primary actions** are `bg-ink text-canvas` pills that turn `bg-primary`
  on hover (auth submit, onboarding continue, nav CTA). Brand-blue filled
  buttons are for the single hero CTA of a page.
- No purple, no gradient text, no neon glows. Light and dark mode are both
  first-class; check both.

## 3. Type

- **Geist** (sans) for everything, **Geist Mono** for times, phone numbers,
  counts, step indices (`font-mono`). Loaded via `next/font` in the layout.
- Display headings: `font-semibold tracking-[-0.045em] leading-[1.02-1.05]`.
  Scale: hero 64-76px, section 56-68px, page title 40-44px, card title
  24-30px. Mobile drops one step (34px section, 32px page title).
- Body: 15-17px, `leading-relaxed`, `text-slate`, `text-pretty`; headings
  `text-balance`.
- Labels above inputs: `text-[13px] font-medium text-graphite`; "optional"
  hints `text-[12px] text-muted` (no brackets).
- Eyebrows (small uppercase tracking labels) are rationed: max one per three
  sections. Prefer none.
- No em dashes in UI copy; use a hyphen or restructure.

## 4. Shape, depth, spacing

- Radii: inputs/small buttons `14px`, cards `22-28px`, big panels `32-36px`,
  chips/pills/primary buttons `rounded-full`. Keep this mapping.
- Cards: `bg-surface border border-line` (or `ring-1 ring-line`), shadows only
  for floating things (`--shadow-float`). Group with spacing before adding a
  card.
- Split layouts (auth, onboarding): `lg:grid lg:h-svh lg:p-3` with the stage as
  a rounded-[32px] panel; the page never scrolls on desktop, only the form
  column does (`lg:min-h-0 lg:overflow-y-auto`). Use the `short:` (<=860px
  tall) and `xshort:` (<=760px) variants to compact for laptops.
- Mobile first. Every layout states its `<lg` fallback explicitly; no
  horizontal scroll; tap targets >= 44px; `min-h-[100dvh]`/`svh`, never
  `h-screen`.

## 5. Components (patterns to reuse)

| Need | Use |
|---|---|
| Text input | `authInput` (`components/auth/styles.ts`): h-52px, rounded-14, `focus:ring-4 ring-primary/15`, leading icon via `peer` + `peer-focus:text-primary` |
| Choice chips | Pill label wrapping a hidden radio/checkbox, `has-[:checked]:bg-ink has-[:checked]:text-canvas` |
| Primary button | `bg-ink text-canvas rounded-full h-12/52px`, hover `bg-primary`, `active:scale-[0.97]`, arrow icon nudges right on hover |
| Secondary | `border border-line rounded-full`, hover `border-ink/25` |
| Glass (on stage/over imagery) | `.glass` utility (has reduced-transparency fallback) |
| Icon tile | `h-12 w-12 rounded-2xl bg-primary-soft text-primary` |
| Progress | 5-6px track `bg-line`, fill `bg-primary` with `.hp-fill` entrance |
| Empty state | Honest: no fake numbers. Icon tile + one line + one action; "ghost" skeleton shapes allowed as illustration |
| Sticky action bar | `sticky bottom-0 border-t border-line bg-canvas/85 backdrop-blur-xl` |
| Icons | `components/ui/Icon.tsx` only (one stroke family). Add glyphs there |
| Dashboard pieces | `components/dashboard/kit.tsx`: `PageHeader`, `Panel`, `Badge` (tone + icon, never colour alone), `Initials`, `Toggle`, `Segmented`, `EmptyState`, `DetailRow`, button classes |
| List + detail | `DetailSheet`: sticky side panel on `lg`, bottom sheet on phones |
| Overlays | Anything `position: fixed` inside a page goes through `createPortal(…, document.body)` gated by `useIsClient()`; `.auth-rise` ancestors (filter/transform) otherwise trap it |

## 6. Motion

Libraries: **GSAP** (+ScrollTrigger, SplitText) for scroll/scrub/pin and
pointer physics; **CSS keyframes** for entrances; **R3F/Three** only for the
landing 3D story; **Lenis** smooth scroll on the landing page (via
`lib/lenis.ts` when you need to scroll programmatically).

| Pattern | How |
|---|---|
| Staggered entrance | wrap in `.auth-rise`, set `style={{"--i": n}}` per child (rise + unblur, 70ms steps) |
| Headline reveal | `<SplitReveal>` (lines rise from masks) |
| Reading reveal | `<ScrubText>` (words light up with scroll) |
| Section reveal | `<Reveal>` (y + blur, IntersectionObserver) |
| Hover physics | `<Magnetic>` for hero CTAs, `<TiltCard>` for showcase cards |
| Live value change | key the element by its value + `.hp-flash` / `.hp-pop` |
| Float | `.hp-bob` on an INNER wrapper (it owns `transform`) |
| Floating card in | `.hp-rise-in` |

Rules: animate only `transform`/`opacity`/`filter`/`clip-path`; ease
`--ease-out-expo` for UI, `--ease-spring` for playful pops; durations
150-300ms for micro, 700-1200ms for entrances; every animation has a
`prefers-reduced-motion` fallback (most utilities already include one); never
`window.addEventListener("scroll")` (use ScrollTrigger); one marquee per page.

## 7. Copy & data

- Every user-facing string lives in `messages/en.json` + `messages/de.json`
  (add both). Client components inside a separate React root (R3F, drei
  `<Html>`) can't use `useTranslations`: pass resolved strings as props.
- No invented metrics, testimonials or logos on public pages.
- Dashboard (until the backend exists): every page reads sample data from
  `lib/mock/dashboard.ts`, flagged by the "Sample data" chip in the header.
  Swap that module for real queries; don't hard-code demo values in pages.
  Real empty states (`EmptyState` in `components/dashboard/kit.tsx`) stay.

## 8. Pre-flight

- [ ] Tokens only (except night-blue stage), one accent
- [ ] Both themes checked; contrast AA
- [ ] Mobile 360-390px checked, no horizontal scroll, no clipped hero
- [ ] Reduced motion respected
- [ ] `npx tsc --noEmit` and `npx eslint` clean; `npm run build` before merging
