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

- `index.html` — Home. A single combined CTA ("Need staff, or want to join
  our team?") sits early on the page and scrolls down to the same
  Request Staff / Join the Team form embedded at the bottom — no separate
  page visit needed for the common case.
- `services.html` — Care Homes / Hospitals / Private Clients, staffing models, compliance
- `about.html` — Company story, mission
- `careers.html` — Why work here, roles, links to the application form
- `contact.html` — The same Request Staff / Join the Team form as Home, for
  anyone who lands directly on this page (e.g. from the header/footer links
  on Services, About or Careers) rather than starting from Home

## Before going live

1. **Phone number** — the business doesn't have one listed yet. Once you have
   one, add it to the "Get in touch directly" list on `contact.html` and to
   the footer `<ul>` on every page (search for "Ipswich, Suffolk, UK" — add a
   phone `<li>` alongside it).
2. **Forms — nothing is wired up to send anywhere yet.** This is a static
   site with no server, so right now submitting either mode of the form just
   shows an on-page "thanks" message in the visitor's browser — no email, no
   database, nothing is actually sent or stored anywhere. To make it real,
   sign up for a form backend and paste its endpoint over
   `REPLACE_WITH_YOUR_FORM_ENDPOINT` in **both** `<form action="...">` tags
   — one in `index.html`, one in `contact.html` (they're two independent
   copies of the same form):
   - [Formspree](https://formspree.io) — easiest option. Free plan, no code:
     sign up, create a form, it gives you an endpoint URL and forwards every
     submission straight to your inbox (gy.care.services@gmail.com).
   - [Netlify Forms](https://docs.netlify.com/manage/forms/) — free if the
     site ends up hosted on Netlify; detects the form automatically.
   - Your own backend/endpoint, if you'd rather build one.
   Job applications collect: full name, phone, address, role, experience
   summary, availability (full-time/part-time/nights/weekends), location,
   and right to work. Staffing enquiries collect: full name, phone, email,
   enquiry type, and message.
3. **Testimonials** — deliberately left off since the business is new. Once
   you have real client/staff feedback, it's easy to add a short quotes
   section back in (e.g. on the Home page) — just ask.
4. **Logo** — the header/footer use a recreated SVG shield + pulse mark
   matching your brand colours. If you have the original logo file, swap the
   inline `<svg class="brand-mark">` for an `<img>` tag pointing at it.
   Home and Careers still use the custom flat-style avatar illustrations;
   About now uses your real photo (`images/caregiver.jpg`) — send over more
   photos any time and I'll swap them into Home, Services or Careers too.
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
