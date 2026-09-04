# StanUGC — Outdoor & Adventure UGC Portfolio

A single-page portfolio site for StanUGC, an outdoor / nature / camping / adventure / travel content creator.

## Structure

```
ugc-portfolio/
├── index.html        # the whole page
├── css/style.css     # all styles
├── js/main.js        # content data + interactions
├── images/           # photos + favicon
└── videos/           # (optional) raw video files
```

## How to update content (no coding needed for most of it)

All editable content lives in **`js/main.js`** in two arrays near the top.

### Videos
Videos are YouTube embeds. For each clip, grab the ID from its link
(`youtube.com/shorts/L7Yf1K_uYgg` → `L7Yf1K_uYgg`) and add a line:

```js
const VIDEOS = [
  { id: "L7Yf1K_uYgg", caption: "REI tent field test" },
];
```

> Tip: set the videos to **Unlisted** on YouTube so they don't show on your
> channel or in search, but still play here.

### Trips
```js
const TRIPS = [
  { name: "Snowdonia", location: "Wales",
    blurb: "Two nights wild camping above the clouds.",
    image: "images/snowdonia.jpg" },   // optional — omit for a colour card
];
```

### About text, email & socials
Open **`index.html`** and edit:
- the **About** section copy (search for "Placeholder"),
- the email in the **Contact** section (`hello@stanugc.com`),
- add a photo of yourself: replace the `.about-photo` block with
  `<img src="images/you.jpg" alt="Stan outdoors" />`.

## Viewing locally
Just open `index.html` in a browser, or run a static server from this folder:
`python3 -m http.server` then visit `http://localhost:8000`.
