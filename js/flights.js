// Simulates planes flying great-circle routes between random airport pairs.
// Rendering-agnostic: FlightManager just owns state; main.js draws it to canvas.

function unwrapLng(prevUnwrapped, rawLng) {
  const wrappedPrev = ((prevUnwrapped % 360) + 540) % 360 - 180;
  let d = rawLng - wrappedPrev;
  while (d > 180) d -= 360;
  while (d < -180) d += 360;
  return prevUnwrapped + d;
}

class Flight {
  constructor(id, origin, dest) {
    this.id = id;
    this.origin = origin;
    this.dest = dest;
    this.distanceKm = haversineDistanceKm(origin, dest);
    // Longer routes take longer, but keep pace lively for gameplay.
    this.duration = Math.min(75000, Math.max(22000, this.distanceKm * 6));
    this.startedAt = performance.now();
    this.trail = [{ lat: origin.lat, lng: origin.lng }];
    this.unwrappedLng = origin.lng;
    this.locked = false; // true while the player has this flight open in the guess panel
    this.done = false;
    this.lastScreen = null; // {x, y} set each render frame, used for click hit-testing
  }

  progress(now) {
    return Math.min(1, (now - this.startedAt) / this.duration);
  }

  // Advances trail bookkeeping and returns the current {lat, lng, bearingDeg, t}.
  step(now, trailMaxPoints) {
    const t = this.progress(now);
    const p = slerp(this.origin, this.dest, t);
    this.unwrappedLng = unwrapLng(this.unwrappedLng, p.lng);
    const point = { lat: p.lat, lng: this.unwrappedLng };

    const ahead = slerp(this.origin, this.dest, Math.min(1, t + 0.01));
    const bearingDeg = bearing(point, { lat: ahead.lat, lng: ahead.lng });

    this.trail.push(point);
    if (this.trail.length > trailMaxPoints) this.trail.shift();

    if (t >= 1) this.done = true;
    return { ...point, bearingDeg, t };
  }
}

class FlightManager {
  constructor(airports, opts = {}) {
    this.airports = airports;
    this.maxConcurrent = opts.maxConcurrent || 14;
    this.flights = new Map();
    this.nextId = 1;
    this.trailMaxPoints = opts.trailMaxPoints || 60;
  }

  randomAirportPair() {
    const n = this.airports.length;
    let a, b, dist;
    let attempts = 0;
    do {
      a = this.airports[Math.floor(Math.random() * n)];
      b = this.airports[Math.floor(Math.random() * n)];
      dist = a === b ? 0 : haversineDistanceKm(a, b);
      attempts++;
    } while ((a === b || dist < 700 || dist > 16000) && attempts < 50);
    return [a, b];
  }

  spawn() {
    const [origin, dest] = this.randomAirportPair();
    const flight = new Flight(this.nextId++, origin, dest);
    this.flights.set(flight.id, flight);
    return flight;
  }

  fillToCapacity() {
    while (this.flights.size < this.maxConcurrent) {
      this.spawn();
    }
  }

  release(flightId) {
    const flight = this.flights.get(flightId);
    if (!flight) return;
    this.flights.delete(flight.id);
  }

  // Advances every flight's animation state; removes finished, unlocked flights.
  tick(now) {
    for (const flight of Array.from(this.flights.values())) {
      const point = flight.step(now, this.trailMaxPoints);
      if (flight.done && !flight.locked) {
        this.flights.delete(flight.id);
      } else {
        flight._current = point;
      }
    }
    this.fillToCapacity();
  }

  active() {
    return Array.from(this.flights.values());
  }
}
