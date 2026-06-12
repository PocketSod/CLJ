# Project Brief — Center for Language Justice (CLJ)

## Organization

The Center for Language Justice is a **worker-owned cooperative** providing interpretation, translation, training, cultural brokering, and language justice consulting for Indianapolis and Marion County. It centers languages of limited diffusion (Burmese, Karen, Kinyarwanda, Somali, Haitian Creole, K'iche', and others) and operates on a tiered pricing model where institutional/corporate revenue cross-subsidizes grassroots community work. Projected launch: mid-2027.

**Core principle:** Language justice is also disability justice and racial justice. Two-way simultaneous interpretation — where English speakers wear the headset — is the standard practice.

---

## Website

**Repo:** `PocketSod/CLJ` on GitHub  
**Live URL:** `https://PocketSod.github.io/CLJ/` (GitHub Pages, branch `main`)  
**Custom domain (planned):** `iljc.pocketsod.com`  
**Local dev:** `node serve.mjs` → `http://localhost:3000`

### Current State

One production landing page (`index.html`) with inline styles only — no build step, no external CSS. Design uses a dark brown / amber / cream brand palette derived from an Indianapolis street mural. Key UI elements:

- Full-width hero photo (`brand-assets/Background.png`) at natural aspect ratio, fading into the page background
- Nav and footer both display `brand-assets/logo.png`
- Luma calendar embed (`cal-X3AX7BxKEdAT8me`) linking to `https://luma.com/clj`
- A `design/` folder holds a wireframe and architecture notes; a `prototype/` folder holds an earlier home page draft

### Tech Stack

| Layer | Choice |
|---|---|
| Frontend | Static HTML + inline `<style>` blocks; Tailwind CDN |
| Events | Luma (`luma.com/clj`), iCal: `luma.com/clj/ics` |
| Backend (planned) | Supabase (Postgres + Auth + Storage + Edge Functions) |
| Email (planned) | Resend |
| Hosting | GitHub Pages |

---

## Brand Assets

All in `brand-assets/`:

| File | Use |
|---|---|
| `logo.png` | Nav (44px tall) and footer (48px tall) |
| `Favicon.png` | `<link rel="icon">` in all HTML files |
| `OGlogo.png` | `og:image` and `twitter:image` meta tags |
| `Background.png` | Full-width hero `<img>` at natural aspect ratio — no cropping |

**Palette:**
```
--brown:        #3D2810
--brown-2:      #2A1A08  (page background)
--amber:        #C9922A  (primary accent)
--amber-light:  #E0B050
--copper:       #B07840
--cream:        #F5EDD8
```

---

## Roadmap

### Immediate (pre-launch content)
- Replace placeholder stats, provider names, event dates, phone number, and email
- Enable GitHub Pages; verify custom domain

### Pages to build
- Services detail page
- Full calendar page (Luma embed + iCal link)
- Membership / join page with application form
- Member directory (searchable by language and service type)
- About page
- Contact / service request form

### Backend (Supabase + Luma hybrid)
- **Phase 1:** Supabase project, schema, RLS, auth (magic link), storage buckets
- **Phase 2:** Luma org setup, embed on homepage
- **Phase 3:** Resend email + Edge Functions (request notifications, approval flow, booking confirmations)
- **Phases 4–7:** Supabase JS client, public forms, member portal (profile, calendar, requests), admin panel
- **Phase 8–9:** QA, go-live checklist

Full task list: [`design/backend-tasks.md`](design/backend-tasks.md)  
Architecture detail: [`design/backend-architecture.md`](design/backend-architecture.md)

---

## Key Links

| Resource | URL |
|---|---|
| Public calendar | `https://luma.com/clj` |
| iCal subscribe | `https://luma.com/clj/ics` |
| Luma embed ID | `cal-X3AX7BxKEdAT8me` |
| Business plan | [`content/Center_for_Language_Justice.md`](content/Center_for_Language_Justice.md) |
| Open tasks | [`NEXT-STEPS.md`](NEXT-STEPS.md) |
