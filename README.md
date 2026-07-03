# SkyGuess

A FlightRadar-style guessing game. Planes cross a world map along real great-circle
flight paths, but carry no labels. Click a plane, search for its origin and
destination airport, and submit your guess before it lands.

## Play

Open `index.html` in any browser. No build step, no server, and no internet
connection required — the map, airport data, and game logic are all self-contained.

## How it works

- **Map**: hand-drawn simplified world outline rendered on `<canvas>`, with pan
  (drag) and zoom (scroll wheel).
- **Flights**: ~60 major world airports, randomly paired into routes. Planes
  animate along spherical (great-circle) interpolated paths, matching how real
  long-haul flights curve on a flat map.
- **Scoring**: +50 for the correct origin, +50 for the correct destination,
  +20 bonus for getting both right. Track your streak across rounds.

## Files

- `index.html` — page shell and UI
- `css/style.css` — styling
- `js/airports.js` — airport data (code, city, country, lat/lng)
- `js/geo.js` — great-circle math (haversine distance, slerp, bearing)
- `js/worldmap.js` — simplified continent outlines for the map background
- `js/flights.js` — flight simulation state (spawn, animate, recycle)
- `js/game.js` — guess panel, airport autocomplete, scoring
- `js/main.js` — canvas rendering, pan/zoom, input wiring
