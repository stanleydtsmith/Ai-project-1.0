// Guess-panel UI, airport autocomplete, and scoring logic.

class AutoComplete {
  constructor(inputEl, listEl, airports) {
    this.inputEl = inputEl;
    this.listEl = listEl;
    this.airports = airports;
    this.selected = null;

    this.inputEl.addEventListener("input", () => this._onInput());
    this.inputEl.addEventListener("focus", () => this._onInput());
    document.addEventListener("click", (e) => {
      if (!this.listEl.contains(e.target) && e.target !== this.inputEl) {
        this._hide();
      }
    });
  }

  _onInput() {
    this.selected = null;
    const q = this.inputEl.value.trim().toLowerCase();
    if (!q) {
      this._hide();
      return;
    }
    const matches = this.airports
      .filter(
        (a) =>
          a.city.toLowerCase().includes(q) ||
          a.code.toLowerCase().includes(q) ||
          a.country.toLowerCase().includes(q)
      )
      .slice(0, 8);
    this._render(matches);
  }

  _render(matches) {
    this.listEl.innerHTML = "";
    if (matches.length === 0) {
      this._hide();
      return;
    }
    matches.forEach((a) => {
      const item = document.createElement("div");
      item.className = "ac-item";
      item.textContent = `${a.city} (${a.code}) — ${a.country}`;
      item.addEventListener("mousedown", (e) => {
        e.preventDefault();
        this.select(a);
      });
      this.listEl.appendChild(item);
    });
    this.listEl.classList.add("visible");
  }

  select(airport) {
    this.selected = airport;
    this.inputEl.value = `${airport.city} (${airport.code})`;
    this._hide();
  }

  _hide() {
    this.listEl.classList.remove("visible");
    this.listEl.innerHTML = "";
  }

  reset() {
    this.selected = null;
    this.inputEl.value = "";
    this.inputEl.disabled = false;
    this._hide();
  }

  lock() {
    this.inputEl.disabled = true;
    this._hide();
  }
}

class Game {
  constructor(flightManager, els) {
    this.flightManager = flightManager;
    this.els = els;
    this.score = 0;
    this.streak = 0;
    this.bestStreak = 0;
    this.correctCount = 0;
    this.totalCount = 0;
    this.currentFlight = null;
    this.answered = false;

    this.originAC = new AutoComplete(els.originInput, els.originList, AIRPORTS);
    this.destAC = new AutoComplete(els.destInput, els.destList, AIRPORTS);

    els.submitBtn.addEventListener("click", () => this.submitGuess());
    els.giveUpBtn.addEventListener("click", () => this.giveUp());
    els.closeBtn.addEventListener("click", () => this.closePanel());
    els.nextBtn.addEventListener("click", () => this.closePanel());

    this._updateStatsUI();
  }

  openPanel(flight) {
    if (this.currentFlight) return; // one guess at a time
    flight.locked = true;
    this.currentFlight = flight;
    this.answered = false;

    this.originAC.reset();
    this.destAC.reset();
    this.els.feedback.classList.remove("visible", "correct", "partial", "wrong");
    this.els.feedback.textContent = "";
    this.els.submitBtn.classList.remove("hidden");
    this.els.giveUpBtn.classList.remove("hidden");
    this.els.nextBtn.classList.add("hidden");
    this.els.panel.classList.add("visible");
    this.els.panelSubtitle.textContent = `Distance flown so far: guess its route`;
  }

  closePanel() {
    if (this.currentFlight) {
      this.currentFlight.locked = false;
      this.flightManager.release(this.currentFlight.id);
    }
    this.currentFlight = null;
    this.els.panel.classList.remove("visible");
  }

  submitGuess() {
    if (this.answered || !this.currentFlight) return;
    const originGuess = this.originAC.selected;
    const destGuess = this.destAC.selected;
    if (!originGuess || !destGuess) {
      this.els.feedback.textContent = "Pick both an origin and a destination first.";
      this.els.feedback.classList.add("visible");
      return;
    }
    this._resolve(originGuess, destGuess, false);
  }

  giveUp() {
    if (this.answered || !this.currentFlight) return;
    this._resolve(null, null, true);
  }

  _resolve(originGuess, destGuess, gaveUp) {
    const flight = this.currentFlight;
    const originCorrect = !gaveUp && originGuess.id === flight.origin.id;
    const destCorrect = !gaveUp && destGuess.id === flight.dest.id;

    let points = 0;
    if (!gaveUp) {
      if (originCorrect) points += 50;
      if (destCorrect) points += 50;
      if (originCorrect && destCorrect) points += 20;
    }

    this.score += points;
    this.totalCount += 1;
    if (originCorrect && destCorrect) {
      this.correctCount += 1;
      this.streak += 1;
      this.bestStreak = Math.max(this.bestStreak, this.streak);
    } else {
      this.streak = 0;
    }

    this.answered = true;
    this.originAC.lock();
    this.destAC.lock();
    this.els.submitBtn.classList.add("hidden");
    this.els.giveUpBtn.classList.add("hidden");
    this.els.nextBtn.classList.remove("hidden");

    const answerText = `${flight.origin.city} (${flight.origin.code}) → ${flight.dest.city} (${flight.dest.code})`;
    let cls = "wrong";
    let msg;
    if (gaveUp) {
      msg = `The route was ${answerText}.`;
    } else if (originCorrect && destCorrect) {
      cls = "correct";
      msg = `Correct! ${answerText}. +${points} points`;
    } else if (originCorrect || destCorrect) {
      cls = "partial";
      msg = `Half right. Actual route: ${answerText}. +${points} points`;
    } else {
      msg = `Not quite. Actual route: ${answerText}.`;
    }
    this.els.feedback.textContent = msg;
    this.els.feedback.classList.add("visible", cls);

    this._updateStatsUI();
  }

  _updateStatsUI() {
    this.els.scoreEl.textContent = this.score;
    this.els.streakEl.textContent = this.streak;
    const acc = this.totalCount ? Math.round((this.correctCount / this.totalCount) * 100) : 0;
    this.els.accuracyEl.textContent = `${this.correctCount}/${this.totalCount} (${acc}%)`;
  }
}
