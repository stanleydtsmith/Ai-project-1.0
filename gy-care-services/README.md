# GY Care Services

Marketing website for GY Care Services, a nurse-led UK healthcare staffing
agency supplying qualified, compassionate professionals to care homes,
hospitals and private clients.

## Run it

Open `index.html` in any browser, or serve the folder locally:

```
python3 -m http.server 8000
```

No build step, no dependencies — plain HTML/CSS/JS, ready to host anywhere
(Netlify, Vercel static hosting, cPanel, S3, GitHub Pages, etc.).

## Pages

- `index.html` — Home
- `services.html` — Care Homes / Hospitals / Private Clients, staffing models, compliance
- `about.html` — Company story, mission, why choose us
- `careers.html` — Join the team + application form
- `testimonials.html` — Client & staff quotes
- `contact.html` — Enquiry form + contact details

## Before going live

1. **Contact details** — replace every `[Add phone number]` / `[Add email address]`
   placeholder (footer on every page, and the Contact page) with your real details.
2. **Forms** — the enquiry form (`contact.html`) and application form
   (`careers.html`) currently show a client-side "success" message but don't
   send anywhere. Point their `<form action="...">` at a form backend, e.g.:
   - [Formspree](https://formspree.io) (supports file uploads on paid plans)
   - [Netlify Forms](https://docs.netlify.com/manage/forms/) (if hosting on Netlify)
   - Your own form-handling endpoint
   Once you have an endpoint, replace `REPLACE_WITH_YOUR_FORM_ENDPOINT` in
   both files' `<form action="...">` attributes.
3. **Testimonials** — `testimonials.html` (and the two teaser quotes on the
   Home page) use sample quotes for layout. Swap in real client/staff
   feedback — see the note under the section heading.
4. **Logo** — the header/footer use a recreated SVG shield + pulse mark
   matching your brand colours. If you have the original logo file, swap the
   inline `<svg class="brand-mark">` for an `<img>` tag pointing at it.
5. **CQC/DBS specifics** — the Services page describes vetting in general
   terms (identity checks, DBS, training, references). Add your actual CQC
   registration number or accreditation details if you'd like them displayed.

## Structure

- `css/style.css` — all styling, design tokens at the top (`:root` variables)
- `js/main.js` — mobile nav toggle, scroll-reveal for the pulse dividers, form handling
- `images/favicon.svg` — browser tab icon (shield + pulse mark)

## Design notes

Brand palette: navy `#16324f`, blue `#1b6fb5`, teal `#14b8a6`, amber accent
`#f2a93b`. Typefaces: Space Grotesk (headings), IBM Plex Sans (body), IBM
Plex Mono (labels/captions), loaded from Google Fonts.

The heartbeat/EKG pulse line from the GY Care Services logo is used as the
site's recurring signature element — it appears in the hero, as animated
section dividers, and in the brand mark — rather than as one-off decoration.
