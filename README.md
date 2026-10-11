# Greenfield Golden Resources Ltd website

Five-page marketing site: home, fumigation, technical supplies, about, and a booking page.
Next.js (App Router) + TypeScript, react-three-fiber for the hero scene, Motion for scroll
animation and page transitions, plain CSS with design tokens.

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build
npm run lint
npm run typecheck
```

Needs Node 20 or newer. The first build downloads the Archivo font from Google Fonts.

## Status: not yet built or run

This code was written in an environment that could not reach the npm registry, so
`npm install`, `npm run build`, lint and typecheck have **not** been run.

What was checked: every file parses as valid TypeScript/TSX, and the HTML and CSS of all
five pages were rendered and inspected at 1366px and 390px with stand-ins for Next, Motion,
Lucide and the 3D canvas.

What was not checked: type errors, the 3D scene (`TreatmentScene.tsx`) on a real GPU, the
scroll animation timing, page transitions, the Archivo font, and the mobile menu in a browser.
Start with `npm run typecheck`, then scroll the home page.

## Where things live

| Path | What it is |
| --- | --- |
| `src/lib/site.ts` | All company facts and lists. Edit phone numbers, addresses, services here. |
| `src/app/globals.css` | Design tokens (colours from the logo) and every style. |
| `src/components/TreatmentHero.tsx` | Pinned hero: maps scroll position to text beats. |
| `src/components/TreatmentScene.tsx` | The three.js scene, loaded only in the browser. |
| `src/components/BookingForm.tsx` | Booking form with validation. |
| `src/app/template.tsx` | Page transition. |

## The booking form has no backend

Submitting writes an email to the company address and opens it in the visitor's mail app.
Nothing is stored or sent by the site. To receive bookings directly, replace the `mailto:`
line in `handleSubmit` with a `fetch` to an API route or a form service, and only show a
success message after the server confirms.

## Content to confirm with the client

- Client names on the home page were read from logos in the company profile.
- The two client quotes are unattributed in the profile.
- "How a booking works" on the fumigation page describes a reasonable process; confirm it matches theirs.
- Photos come from the profile PDF and are low resolution (the largest is 867px wide). Originals would look sharper.
- Photo captions describe what is visible; confirm the wording.
