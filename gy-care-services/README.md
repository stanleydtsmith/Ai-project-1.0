# GY Care Services

Marketing website for GY Care Services, a nurse-led UK healthcare staffing
agency supplying qualified, compassionate professionals to care homes,
hospitals and private clients. Based in Ipswich, Suffolk — serving clients
UK-wide.

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
- `about.html` — Company story, mission
- `careers.html` — Why work here, roles, links to the application form
- `contact.html` — One form covering both staffing enquiries and job applications
  (toggle between "Request Staff" and "Join the Team"), plus contact details

## Before going live

1. **Phone number** — the business doesn't have one listed yet. Once you have
   one, add it to the "Get in touch directly" list on `contact.html` and to
   the footer `<ul>` on every page (search for "Ipswich, Suffolk, UK" — add a
   phone `<li>` alongside it).
2. **Forms** — the combined enquiry/application form on `contact.html` shows
   a client-side "success" message but doesn't send anywhere yet. Point its
   `<form action="...">` at a form backend, e.g.:
   - [Formspree](https://formspree.io) (supports file uploads on paid plans)
   - [Netlify Forms](https://docs.netlify.com/manage/forms/) (if hosting on Netlify)
   - Your own form-handling endpoint
   Once you have an endpoint, replace `REPLACE_WITH_YOUR_FORM_ENDPOINT` in
   that file's `<form action="...">` attribute.
3. **Testimonials** — deliberately left off since the business is new. Once
   you have real client/staff feedback, it's easy to add a short quotes
   section back in (e.g. on the Home page) — just ask.
4. **Logo** — the header/footer use a recreated SVG shield + pulse mark
   matching your brand colours, and the illustrated "staff" graphics on
   Home/About/Careers are custom flat-style avatars in the same palette
   (no stock photography used). If you have the original logo file, swap the
   inline `<svg class="brand-mark">` for an `<img>` tag pointing at it.
5. **CQC/DBS specifics** — the Services page describes vetting in general
   terms (identity checks, DBS, training, references). Add your actual CQC
   registration number or accreditation details if you'd like them displayed.

## Structure

- `css/style.css` — all styling, design tokens at the top (`:root` variables)
- `js/main.js` — mobile nav toggle, scroll-reveal for the pulse dividers,
  contact/apply intent toggle, form handling
- `images/favicon.svg` — browser tab icon (shield + pulse mark)

## Design notes

Brand palette: navy `#16324f`, blue `#1b6fb5`, teal `#14b8a6`, amber accent
`#f2a93b`. Typefaces: Space Grotesk (headings), IBM Plex Sans (body), IBM
Plex Mono (labels/captions), loaded from Google Fonts.

The heartbeat/EKG pulse line from the GY Care Services logo is used as the
site's recurring signature element — it appears in the hero, as animated
section dividers, and in the brand mark. The illustrated avatar figures
(hero, About, Careers) extend the same visual language (brand-gradient
"person" shapes) rather than using stock photography.

`contact.html?intent=apply` pre-selects the "Join the Team" mode of the
contact form — used by the Careers page's "Start Your Application" button.
