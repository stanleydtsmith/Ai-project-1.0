# StanUGC — Outdoor & Adventure UGC Portfolio

A single-page portfolio for StanUGC — a university student creating outdoor,
nature, camping, adventure and travel UGC.

## Structure

```
ugc-portfolio/
├── index.html        # the page
├── css/style.css     # all styles
├── js/main.js        # content data + interactions
└── images/           # photos + favicon
```

The page flows: **Hero → About (intro video) → Places I've visited recently
(travel videos + photo gallery) → Brand & product work (product videos) →
Contact**.

## Updating content (in `js/main.js`)

All videos and photos are defined at the top of `js/main.js`.

**Videos** are YouTube embeds. Grab the ID from a link
(`youtube.com/shorts/L7Yf1K_uYgg` → `L7Yf1K_uYgg`):

```js
const INTRO_ID = "L7Yf1K_uYgg";              // talk-to-camera intro
const PLACES_VIDEOS = [{ id: "XCZQV0GAcYA", caption: "Dolomites day 1" }, ...];
const WORK_VIDEOS   = [{ id: "WBum-Vdbyyc", caption: "Tent review" }, ...];
```

> Tip: set clips to **Unlisted** on YouTube so they don't show on your channel
> or in search, but still play here.

**Photos** live in `images/`. Add a file, then reference it:

```js
const PHOTOS = [
  { src: "images/summit-trig.jpeg", caption: "Summit push in the mist" },
];
```

## Other edits (in `index.html`)
- About copy — the `.about-copy` block.
- Hero background photo — set in `css/style.css` (`.hero-photo`, currently
  `images/hero-dolomites.jpeg`).
- Contact email — `stanleydtsmith@outlook.com` in the Contact section.

## Viewing locally
Open `index.html`, or run `python3 -m http.server` from this folder and visit
`http://localhost:8000`.
