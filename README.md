# Ironhand Barbers

A concept site for a Tbilisi barbershop, built around one thing a barbershop
actually needs: a booking flow that takes four taps and never asks you to
telephone.

**Live:** https://greenhugebrain.github.io/ironhand-barbers/

React and Vite. No dependencies beyond React, no backend.

## What it does

Barber, service, time, details — four steps, each one narrowing the next. Pick
Saba and the service list drops to what Saba does. Pick a forty-minute shave and
the diary stops offering slots that would run past closing.

- `src/booking.js` — the diary. Opening hours per weekday, thirty-minute steps,
  and slots dropped when the chosen service would overrun closing time. Today's
  past slots disappear. Which slots read as taken comes from an FNV-1a hash of
  day + barber + time, so they stay put across re-renders instead of flickering
  on every keystroke.
- `src/App.jsx` — the page and the flow. The step state machine lives in
  `Booking`; changing barber clears a service that barber does not offer, rather
  than leaving an impossible combination in state.
- `src/data.js` — shop details, services, barbers, FAQ. Everything the owner
  would want to change is here and nowhere else.

Nothing is sent anywhere. The confirmation panel says so plainly, because a
demonstration that pretends to book a real chair is worse than useless.

## Design

Oswald for display, Inter for text, one red against near-black. The barbers are
typographic cards rather than headshots — a concept site should not put a
stranger's face on a business that does not exist.

## Pages

Five real pages, not anchors on one:

| Path | What is on it |
|---|---|
| `/` | Hero, a short price teaser, the barbers, gallery strip |
| `/services/` | Full price list, opening hours, address, FAQ |
| `/barbers/` | Each barber with the services they take |
| `/gallery/` | The photographs, full size on click |
| `/book/` | The four-step booking flow |

Vite builds each from its own HTML entry and React root, so the URLs are real and
there is no client-side router. Rollup splits React and the shared chrome into one
chunk the browser keeps between pages, leaving 1-8 kB per page.

## Run locally

```bash
npm install
npm run dev
```

`npm run build` outputs to `dist/`, which the GitHub Actions workflow publishes
to Pages on every push to `master`.
