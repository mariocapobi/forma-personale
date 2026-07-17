(() => {
  "use strict";

  const STORAGE_KEY = "forma-personale-v1";
  const routes = ["oggi", "allenamento", "alimentazione", "preferenze", "dati"];
  const dayNames = ["Lunedì", "Martedì", "Mercoledì", "Giovedì", "Venerdì", "Sabato", "Domenica"];
  const shortDayNames = ["Lun", "Mar", "Mer", "Gio", "Ven", "Sab", "Dom"];

  const foods = [
    { id: "yogurt-greco", name: "Yogurt greco 0–2%", portion: "200 g", group: "dairy-protein", kcal: 120, protein: 20, tags: ["cremoso", "freddo"] },
    { id: "skyr", name: "Skyr", portion: "200 g", group: "dairy-protein", kcal: 120, protein: 22, tags: ["compatto", "freddo"] },
    { id: "fiocchi-latte", name: "Fiocchi di latte", portion: "200 g", group: "dairy-protein", kcal: 190, protein: 24, tags: ["salato", "freddo"] },
    { id: "ricotta-magra", name: "Ricotta vaccina", portion: "180 g", group: "dairy-protein", kcal: 260, protein: 20, tags: ["cremoso", "dolce o salato"] },

    { id: "avena", name: "Fiocchi d’avena", portion: "80 g", group: "breakfast-carb", kcal: 305, protein: 10, tags: ["morbido", "dolce"] },
    { id: "pane-colazione", name: "Pane tostato", portion: "120 g", group: "breakfast-carb", kcal: 320, protein: 10, tags: ["croccante", "neutro"] },
    { id: "cereali-semplici", name: "Cereali poco zuccherati", portion: "90 g", group: "breakfast-carb", kcal: 330, protein: 8, tags: ["croccante", "dolce"] },
    { id: "fette-biscottate", name: "Fette biscottate", portion: "90 g", group: "breakfast-carb", kcal: 350, protein: 9, tags: ["croccante", "dolce"] },

    { id: "burro-arachidi", name: "Burro d’arachidi", portion: "15 g", group: "fat", kcal: 90, protein: 4, tags: ["cremoso"] },
    { id: "mandorle", name: "Mandorle", portion: "15 g", group: "fat", kcal: 90, protein: 3, tags: ["croccante"] },
    { id: "olio", name: "Olio extravergine", portion: "10 g", group: "fat", kcal: 90, protein: 0, tags: ["condimento"] },
    { id: "noci", name: "Noci", portion: "15 g", group: "fat", kcal: 100, protein: 2, tags: ["croccante"] },

    { id: "pollo", name: "Petto di pollo", portion: "140 g cotti", group: "main-protein", kcal: 230, protein: 43, tags: ["carne", "delicato"] },
    { id: "tacchino", name: "Fesa di tacchino", portion: "150 g cotti", group: "main-protein", kcal: 225, protein: 42, tags: ["carne", "delicato"] },
    { id: "manzo-magro", name: "Manzo magro", portion: "150 g cotti", group: "main-protein", kcal: 300, protein: 39, tags: ["carne", "saporito"] },
    { id: "tonno", name: "Tonno al naturale", portion: "160 g sgocciolati", group: "main-protein", kcal: 185, protein: 41, tags: ["pesce", "freddo"] },
    { id: "salmone", name: "Salmone", portion: "140 g cotti", group: "main-protein", kcal: 290, protein: 31, tags: ["pesce", "saporito"] },
    { id: "uova", name: "Uova e albume", portion: "2 uova + 180 g albume", group: "main-protein", kcal: 255, protein: 35, tags: ["caldo", "morbido"] },
    { id: "tofu", name: "Tofu compatto", portion: "220 g", group: "main-protein", kcal: 300, protein: 31, tags: ["vegetale", "neutro"] },

    { id: "riso", name: "Riso", portion: "110 g a crudo", group: "main-carb", kcal: 395, protein: 8, tags: ["neutro", "morbido"] },
    { id: "pasta", name: "Pasta", portion: "110 g a crudo", group: "main-carb", kcal: 390, protein: 14, tags: ["neutro"] },
    { id: "patate", name: "Patate", portion: "500 g", group: "main-carb", kcal: 390, protein: 10, tags: ["caldo", "morbido"] },
    { id: "pane", name: "Pane", portion: "150 g", group: "main-carb", kcal: 400, protein: 12, tags: ["neutro"] },
    { id: "couscous", name: "Cous cous", portion: "110 g a crudo", group: "main-carb", kcal: 415, protein: 14, tags: ["granulare"] },
    { id: "piadina", name: "Piadina semplice", portion: "2 piccole, 150 g", group: "main-carb", kcal: 450, protein: 12, tags: ["morbido"] },

    { id: "passata", name: "Passata di pomodoro", portion: "150 g", group: "plant-side", kcal: 50, protein: 2, tags: ["salsa", "liscio"], plant: true },
    { id: "zucchine", name: "Zucchine grigliate", portion: "120 g", group: "plant-side", kcal: 35, protein: 2, tags: ["caldo", "morbido"], plant: true },
    { id: "carote", name: "Carote cotte", portion: "120 g", group: "plant-side", kcal: 50, protein: 1, tags: ["dolce", "morbido"], plant: true },
    { id: "piselli", name: "Piselli", portion: "120 g", group: "plant-side", kcal: 95, protein: 6, tags: ["dolce", "morbido"], plant: true },
    { id: "ceci", name: "Ceci croccanti o in crema", portion: "100 g cotti", group: "plant-side", kcal: 165, protein: 9, tags: ["cremoso o croccante"], plant: true },
    { id: "lenticchie-crema", name: "Crema di lenticchie", portion: "130 g", group: "plant-side", kcal: 145, protein: 9, tags: ["liscio", "caldo"], plant: true },
    { id: "minestrone-frullato", name: "Minestrone frullato", portion: "180 g", group: "plant-side", kcal: 90, protein: 4, tags: ["liscio", "caldo"], plant: true },

    { id: "banana", name: "Banana", portion: "1 media", group: "fruit", kcal: 105, protein: 1, tags: ["dolce", "morbido"], plant: true },
    { id: "fragole", name: "Fragole", portion: "180 g", group: "fruit", kcal: 60, protein: 1, tags: ["dolce", "fresco"], plant: true },
    { id: "mela", name: "Mela", portion: "1 media", group: "fruit", kcal: 90, protein: 0, tags: ["croccante", "dolce"], plant: true },
    { id: "pera", name: "Pera", portion: "1 media", group: "fruit", kcal: 100, protein: 1, tags: ["morbido", "dolce"], plant: true },
    { id: "arancia", name: "Arancia", portion: "1 grande", group: "fruit", kcal: 90, protein: 2, tags: ["succoso", "fresco"], plant: true },
    { id: "frullato-intero", name: "Frullato di frutta intera", portion: "200 g, senza filtrare", group: "fruit", kcal: 120, protein: 2, tags: ["liscio", "dolce"], plant: true },

    { id: "skyr-spuntino", name: "Skyr", portion: "170 g", group: "snack-protein", kcal: 100, protein: 18, tags: ["freddo", "cremoso"] },
    { id: "yogurt-spuntino", name: "Yogurt greco", portion: "180 g", group: "snack-protein", kcal: 110, protein: 18, tags: ["freddo", "cremoso"] },
    { id: "bresaola", name: "Bresaola", portion: "80 g", group: "snack-protein", kcal: 120, protein: 26, tags: ["salato", "freddo"] },
    { id: "uova-spuntino", name: "Uova sode", portion: "2", group: "snack-protein", kcal: 145, protein: 13, tags: ["salato", "freddo"] },

    { id: "pane-spuntino", name: "Pane", portion: "120 g", group: "snack-carb", kcal: 320, protein: 10, tags: ["neutro"] },
    { id: "cracker", name: "Cracker semplici", portion: "75 g", group: "snack-carb", kcal: 330, protein: 7, tags: ["croccante", "salato"] },
    { id: "gallette", name: "Gallette di riso", portion: "85 g", group: "snack-carb", kcal: 325, protein: 7, tags: ["croccante", "neutro"] }
  ];

  const foodById = new Map(foods.map((food) => [food.id, food]));

  const baseWeek = [
    {
      short: "Palestra A", kind: "strength", duration: "45 min", effort: "RPE 6–7",
      exercises: [
        ["Squat o goblet squat", "3 × 8", "Tecnica controllata"],
        ["Panca o push-up", "3 × 8–10", "2–3 ripetizioni in riserva"],
        ["Rematore", "3 × 10", "Pausa breve al petto"],
        ["Romanian deadlift + plank", "2 × 10 + 30 s", "Chiusura leggera"]
      ]
    },
    {
      short: "Cammina/corri", kind: "cardio", duration: "30 min", effort: "RPE 4–5",
      exercises: [
        ["Camminata iniziale", "5 min", "Ritmo comodo"],
        ["Corsa facile + camminata", "6 × 3 + 1 min", "Devi riuscire a parlare"],
        ["Defaticamento", "5 min", "Rallenta gradualmente"]
      ]
    },
    {
      short: "Palestra B", kind: "strength", duration: "45 min", effort: "RPE 6–7",
      exercises: [
        ["Leg press", "3 × 10", "Escursione controllata"],
        ["Panca inclinata manubri", "3 × 8–10", "Niente cedimento"],
        ["Lat machine", "3 × 10", "Scapole stabili"],
        ["Hip thrust + Pallof press", "2 × 10", "Chiusura tecnica"]
      ]
    },
    {
      short: "Recupero", kind: "recovery", duration: "20 min", effort: "RPE 2–3",
      exercises: [
        ["Camminata libera", "10 min", "Senza obiettivi"],
        ["Mobilità anche e caviglie", "5 min", "Respirazione tranquilla"],
        ["Mobilità spalle e torace", "5 min", "Movimenti fluidi"]
      ]
    },
    {
      short: "Palestra C", kind: "strength", duration: "40 min", effort: "RPE 6–7",
      exercises: [
        ["Bulgarian split squat", "3 × 8", "Per lato"],
        ["Shoulder press", "3 × 8–10", "Tecnica pulita"],
        ["Rematore o pulley", "3 × 10", "Senza slanci"],
        ["Leg curl + farmer carry", "2 giri", "Chiusura breve"]
      ]
    },
    {
      short: "Basket", kind: "basket", duration: "45–60 min", effort: "RPE 5–7",
      exercises: [
        ["Riscaldamento dinamico", "10 min", "Caviglie, anche, cambi di direzione"],
        ["Tiro, tecnica o partitella", "30–40 min", "Evita un secondo allenamento intenso"],
        ["Defaticamento", "5 min", "Cammina e respira"]
      ]
    },
    {
      short: "Riposo", kind: "rest", duration: "Libero", effort: "Riposo",
      exercises: [
        ["Passeggiata", "Facoltativa", "Solo se ti va"],
        ["Sonno e idratazione", "Priorità", "Prepara la nuova settimana"]
      ]
    }
  ];

  const defaultState = {
    profile: {
      birthDate: null,
      age: null,
      height: null,
      weight: null,
      goal: "recomposition",
      gymMax: 3
    },
    health: {
      date: "2026-07-17",
      sleepHours: 6.8,
      sleepBaseline: 7.5,
      hrv: 52,
      hrvBaseline: 52,
      restingHR: 60,
      restingHRBaseline: 59,
      energy: 7,
      soreness: 4,
      activeEnergy: 620,
      weight: null,
      source: "demo"
    },
    healthHistory: [],
    preferenceScores: {
      passata: 0.5,
      piselli: 0,
      banana: -0.5,
      fragole: -0.5,
      mela: -0.5,
      pera: -0.5,
      arancia: -0.5,
      "frullato-intero": -0.5
    },
    meals: [
      { id: "breakfast", name: "Colazione", slots: ["yogurt-greco", "avena", "burro-arachidi"] },
      { id: "lunch", name: "Pranzo", slots: ["pollo", "riso", "passata", "olio"] },
      { id: "snack", name: "Spuntino", slots: ["skyr-spuntino", "pane-spuntino"] },
      { id: "dinner", name: "Cena", slots: ["salmone", "patate", "piselli", "olio"] }
    ],
    completedDays: {},
    easyDays: {},
    selectedDay: 4,
    plantTrial: null
  };

  let state = loadState();
  let currentSwap = null;
  let toastTimer = null;

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function loadState() {
    const fallback = clone(defaultState);
    try {
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY));
      if (!stored || typeof stored !== "object") return fallback;
      return {
        ...fallback,
        ...stored,
        profile: { ...fallback.profile, ...(stored.profile || {}) },
        health: { ...fallback.health, ...(stored.health || {}) },
        preferenceScores: { ...fallback.preferenceScores, ...(stored.preferenceScores || {}) },
        meals: Array.isArray(stored.meals) ? stored.meals : fallback.meals,
        healthHistory: Array.isArray(stored.healthHistory) ? stored.healthHistory : [],
        completedDays: stored.completedDays || {},
        easyDays: stored.easyDays || {}
      };
    } catch (error) {
      return fallback;
    }
  }

  function saveState() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }

  function roundToFive(value) {
    return Math.round(value / 5) * 5;
  }

  function getMondayIndex(date = new Date()) {
    const day = date.getDay();
    return day === 0 ? 6 : day - 1;
  }

  function dateKey() {
    return new Date().toISOString().slice(0, 10);
  }

  function calculateAge(birthDate) {
    const birth = new Date(`${birthDate}T12:00:00`);
    if (Number.isNaN(birth.getTime())) return null;
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const beforeBirthday = today.getMonth() < birth.getMonth() ||
      (today.getMonth() === birth.getMonth() && today.getDate() < birth.getDate());
    if (beforeBirthday) age -= 1;
    return age;
  }

  function profileComplete() {
    return Boolean(
      state.profile.birthDate &&
      Number.isFinite(Number(state.profile.height)) &&
      Number.isFinite(Number(state.profile.weight)) &&
      Number(state.profile.height) >= 130 &&
      Number(state.profile.weight) >= 30
    );
  }

  function formatDate(date = new Date()) {
    return new Intl.DateTimeFormat("it-IT", { weekday: "long", day: "numeric", month: "long" }).format(date);
  }

  function calculateReadiness() {
    const h = state.health;
    const sleepDelta = h.sleepBaseline > 0 ? (h.sleepHours / h.sleepBaseline) - 1 : 0;
    const hrvDelta = h.hrvBaseline > 0 ? (h.hrv / h.hrvBaseline) - 1 : 0;
    const restingDelta = h.restingHRBaseline - h.restingHR;
    const score = Math.round(clamp(
      68 +
      clamp(sleepDelta * 42, -18, 10) +
      clamp(hrvDelta * 35, -12, 10) +
      clamp(restingDelta * 1.7, -10, 8) +
      (h.energy - 5) * 2.5 -
      (h.soreness - 4) * 2,
      30,
      92
    ));

    const reasons = [];
    if (h.sleepHours < h.sleepBaseline - 0.5) reasons.push("sonno sotto la tua media");
    if (h.sleepHours > h.sleepBaseline + 0.25) reasons.push("sonno sopra la tua media");
    if (hrvDelta < -0.1) reasons.push("HRV più bassa del solito");
    if (hrvDelta > 0.08) reasons.push("HRV favorevole");
    if (h.restingHR > h.restingHRBaseline + 4) reasons.push("frequenza a riposo elevata");
    if (h.soreness >= 7) reasons.push("indolenzimento alto");
    if (h.energy <= 4) reasons.push("energia percepita bassa");
    if (!reasons.length) reasons.push("indicatori vicini alla tua norma");

    if (score >= 78) {
      return { score, mode: "full", status: "Pronto", title: "Puoi seguire il programma", explanation: capitalize(reasons.join(", ")) + "." };
    }
    if (score >= 60) {
      return { score, mode: "reduced", status: "Moderato", title: "Allenati, ma senza forzare", explanation: capitalize(reasons.join(", ")) + ": riduci il volume." };
    }
    return { score, mode: "recovery", status: "Recupero", title: "Oggi conviene recuperare", explanation: capitalize(reasons.join(", ")) + ": passa a una giornata facile." };
  }

  function capitalize(text) {
    return text ? text.charAt(0).toUpperCase() + text.slice(1) : text;
  }

  function reduceDose(dose) {
    if (/^3/.test(dose)) return dose.replace(/^3/, "2");
    if (/^6/.test(dose)) return dose.replace(/^6/, "4");
    if (/45–60/.test(dose)) return dose.replace("45–60", "30–40");
    return dose;
  }

  function scheduledDay(dayIndex) {
    const day = clone(baseWeek[dayIndex]);
    if (day.kind !== "strength") return day;

    const strengthNumber = baseWeek
      .slice(0, dayIndex + 1)
      .filter((item) => item.kind === "strength").length;

    if (strengthNumber <= Number(state.profile.gymMax || 3)) return day;

    return {
      short: "Corpo libero",
      kind: "bodyweight",
      duration: "30 min",
      effort: "RPE 5-6",
      exercises: [
        ["Squat a corpo libero", "3 x 12", "Movimento controllato"],
        ["Push-up facilitati o classici", "3 x 8-12", "Lascia due ripetizioni in riserva"],
        ["Affondi indietro", "2 x 8", "Per lato"],
        ["Ponte glutei + plank", "2 x 12 + 25 s", "Chiusura facile"]
      ]
    };
  }

  function adaptedWorkout(dayIndex) {
    const base = scheduledDay(dayIndex);
    const readiness = calculateReadiness();
    const easy = Boolean(state.easyDays[dayIndex]);

    if (base.kind === "rest") {
      return { ...base, note: "Il riposo non viene trasformato automaticamente in allenamento per recuperare sedute saltate." };
    }
    if (base.kind === "recovery") {
      return { ...base, note: "Mantieni questa giornata facile anche se ti senti bene: prepara la seduta successiva." };
    }
    if (readiness.mode === "recovery" || easy) {
      return {
        short: "Recupero attivo",
        kind: "recovery",
        duration: "20–30 min",
        effort: "RPE 2–3",
        note: easy ? "Hai scelto una giornata più facile. Il programma la considera una decisione valida, non una seduta saltata." : "Il recupero di oggi è basso: sostituisci la seduta con movimento facile.",
        exercises: [
          ["Camminata facile", "15–20 min", "Nessun obiettivo di passo"],
          ["Mobilità generale", "8–10 min", "Movimenti senza dolore"]
        ]
      };
    }
    if (readiness.mode === "reduced") {
      if (base.kind === "strength" || base.kind === "bodyweight") {
        base.duration = base.duration.replace("45", "35").replace("40", "35");
        base.effort = "RPE 6";
        base.note = "Recupero intermedio: una serie in meno per esercizio e niente cedimento.";
        base.exercises = base.exercises.map(([name, dose, cue]) => [name, reduceDose(dose), cue]);
      } else if (base.kind === "basket") {
        base.short = "Basket tecnico";
        base.duration = "30–40 min";
        base.effort = "RPE 5";
        base.note = "Preferisci tiro e tecnica a una partitella molto intensa.";
        base.exercises = [
          ["Riscaldamento", "10 min", "Progressivo"],
          ["Tiro e tecnica", "20–25 min", "Pause libere"],
          ["Defaticamento", "5 min", "Camminata"]
        ];
      } else {
        base.duration = "20–25 min";
        base.effort = "RPE 4";
        base.note = "Accorcia la corsa e mantieni sempre un ritmo conversazionale.";
        base.exercises = base.exercises.map(([name, dose, cue]) => [name, reduceDose(dose), cue]);
      }
      return base;
    }
    base.note = "Recupero buono: programma completo, lasciando comunque due ripetizioni in riserva.";
    return base;
  }

  function navigate(route, updateHash = true) {
    const safeRoute = routes.includes(route) ? route : "oggi";
    document.querySelectorAll("[data-view]").forEach((view) => {
      const active = view.dataset.view === safeRoute;
      view.hidden = !active;
      view.classList.toggle("is-active", active);
    });
    document.querySelectorAll(".nav-item").forEach((item) => {
      const active = item.dataset.routeLink === safeRoute;
      item.classList.toggle("is-active", active);
      if (active) item.setAttribute("aria-current", "page");
      else item.removeAttribute("aria-current");
    });
    if (updateHash && location.hash !== `#${safeRoute}`) history.replaceState(null, "", `#${safeRoute}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function renderToday() {
    const readiness = calculateReadiness();
    const todayIndex = getMondayIndex();
    const workout = adaptedWorkout(todayIndex);
    const h = state.health;
    const sourceIsDemo = h.source === "demo";

    document.getElementById("today-date").textContent = capitalize(formatDate());
    document.getElementById("readiness-score").textContent = readiness.score;
    document.getElementById("score-ring").style.setProperty("--score", readiness.score);
    document.getElementById("score-ring").setAttribute("aria-label", `Recupero ${readiness.score} su 100`);
    document.getElementById("readiness-status").textContent = readiness.status;
    document.getElementById("readiness-title").textContent = readiness.title;
    document.getElementById("readiness-explanation").textContent = readiness.explanation;
    document.getElementById("metric-sleep").textContent = `${formatDecimal(h.sleepHours)} h`;
    document.getElementById("metric-sleep-note").textContent = `media ${formatDecimal(h.sleepBaseline)} h`;
    document.getElementById("metric-hrv").textContent = `${Math.round(h.hrv)} ms`;
    const hrvPct = h.hrvBaseline ? Math.round(((h.hrv / h.hrvBaseline) - 1) * 100) : 0;
    document.getElementById("metric-hrv-note").textContent = `${hrvPct >= 0 ? "+" : ""}${hrvPct}% sulla media`;
    document.getElementById("metric-energy").textContent = `${h.energy}/10`;
    document.getElementById("today-workout-title").textContent = `${workout.short} · ${workout.duration}`;
    document.getElementById("today-workout-effort").textContent = workout.effort;
    document.getElementById("today-workout-summary").textContent = workout.note;

    const syncButton = document.getElementById("quick-sync");
    syncButton.classList.toggle("has-data", !sourceIsDemo);
    document.getElementById("sync-label").textContent = sourceIsDemo ? "Dati demo" : `Aggiornato ${formatShortDate(h.date)}`;
    document.getElementById("data-mode-pill").textContent = sourceIsDemo ? "Demo" : h.source === "shortcut" ? "Importato" : "Manuale";

    const profileWeight = Number(state.profile.weight);
    const proteinTarget = Number.isFinite(profileWeight) && profileWeight > 0 ? roundToFive(profileWeight * 1.6) : "—";
    document.getElementById("protein-target-compact").textContent = proteinTarget;
    document.getElementById("protein-target").textContent = proteinTarget;
    document.getElementById("gym-limit-pill").textContent = profileComplete()
      ? `Massimo ${state.profile.gymMax} palestra`
      : "Palestra adattiva";
  }

  function renderWeek() {
    const strip = document.getElementById("week-strip");
    strip.innerHTML = "";
    baseWeek.forEach((day, index) => {
      const scheduled = scheduledDay(index);
      const button = document.createElement("button");
      button.type = "button";
      button.className = "day-button";
      if (index === state.selectedDay) button.classList.add("is-selected");
      if (state.completedDays[index]) button.classList.add("is-complete");
      button.setAttribute("aria-pressed", String(index === state.selectedDay));
      button.innerHTML = `<strong>${shortDayNames[index]}</strong><span>${scheduled.short}</span><small>${scheduled.duration}</small>`;
      button.addEventListener("click", () => {
        state.selectedDay = index;
        saveState();
        renderWeek();
      });
      strip.appendChild(button);
    });

    const workout = adaptedWorkout(state.selectedDay);
    document.getElementById("workout-day-label").textContent = dayNames[state.selectedDay];
    document.getElementById("workout-detail-title").textContent = `${workout.short} · ${workout.duration}`;
    document.getElementById("workout-detail-effort").textContent = workout.effort;
    document.getElementById("workout-adaptation").textContent = workout.note;
    document.getElementById("exercise-list").innerHTML = workout.exercises.map(([name, dose, cue]) => `
      <div class="exercise-row">
        <div><strong>${name}</strong><small>${cue}</small></div>
        <strong>${dose}</strong>
      </div>
    `).join("");
    const completeButton = document.getElementById("complete-workout");
    const complete = Boolean(state.completedDays[state.selectedDay]);
    completeButton.textContent = complete ? "Completato" : "Segna come completato";
    completeButton.disabled = complete;
  }

  function mealTotals(meal) {
    return meal.slots.reduce((total, id) => {
      const food = foodById.get(id);
      if (!food) return total;
      total.kcal += food.kcal;
      total.protein += food.protein;
      return total;
    }, { kcal: 0, protein: 0 });
  }

  function planTotals() {
    return state.meals.reduce((total, meal) => {
      const mealTotal = mealTotals(meal);
      total.kcal += mealTotal.kcal;
      total.protein += mealTotal.protein;
      return total;
    }, { kcal: 0, protein: 0 });
  }

  function renderMeals() {
    const container = document.getElementById("meal-plan");
    container.innerHTML = state.meals.map((meal, mealIndex) => {
      const totals = mealTotals(meal);
      const rows = meal.slots.map((foodId, slotIndex) => {
        const food = foodById.get(foodId);
        if (!food) return "";
        const score = Number(state.preferenceScores[food.id] || 0);
        return `
          <div class="food-row">
            <div class="food-copy">
              <strong>${food.name}</strong>
              <small>${food.portion} · ${food.kcal} kcal · ${food.protein} g proteine</small>
            </div>
            <div class="food-actions">
              <button class="food-action like ${score >= 2 ? "is-active" : ""}" type="button" data-like="${food.id}">Mi piace</button>
              <button class="food-action" type="button" data-swap="${mealIndex}:${slotIndex}">Cambia</button>
              <button class="food-action dislike ${score <= -2 ? "is-active" : ""}" type="button" data-dislike="${mealIndex}:${slotIndex}">Non mi piace</button>
            </div>
          </div>
        `;
      }).join("");
      return `
        <article class="meal-card">
          <div class="meal-header">
            <h2>${meal.name}</h2>
            <span>${totals.kcal} kcal · ${totals.protein} g proteine</span>
          </div>
          ${rows}
        </article>
      `;
    }).join("");

    container.querySelectorAll("[data-like]").forEach((button) => {
      button.addEventListener("click", () => rateFood(button.dataset.like, 2));
    });
    container.querySelectorAll("[data-swap]").forEach((button) => {
      const [mealIndex, slotIndex] = button.dataset.swap.split(":").map(Number);
      button.addEventListener("click", () => openSwap(mealIndex, slotIndex));
    });
    container.querySelectorAll("[data-dislike]").forEach((button) => {
      const [mealIndex, slotIndex] = button.dataset.dislike.split(":").map(Number);
      button.addEventListener("click", () => dislikeAndReplace(mealIndex, slotIndex));
    });

    const totals = planTotals();
    document.getElementById("plan-calories").textContent = `≈ ${totals.kcal} kcal`;
    const historyDays = new Set(state.healthHistory.map((entry) => entry.date)).size;
    document.getElementById("nutrition-summary").textContent = historyDays >= 14
      ? nutritionCalibrationText()
      : `Piano di partenza ≈ ${totals.kcal} kcal. Servono ancora ${Math.max(0, 14 - historyDays)} giorni di peso e attività per calibrare le porzioni.`;
    document.getElementById("plant-step-label").textContent = state.plantTrial ? "1 scelta" : "1 prova";
  }

  function nutritionCalibrationText() {
    const history = [...state.healthHistory].sort((a, b) => a.date.localeCompare(b.date));
    if (history.length < 7) return "Calibrazione in corso.";
    const first = average(history.slice(0, 3).map((item) => item.weight));
    const last = average(history.slice(-3).map((item) => item.weight));
    const spanDays = Math.max(1, daysBetween(history[0].date, history[history.length - 1].date));
    const weeklyChange = ((last - first) / spanDays) * 7;
    if (weeklyChange < -0.75) return "Il peso sta scendendo rapidamente: l’app suggerirà porzioni leggermente maggiori per proteggere recupero e prestazione.";
    if (weeklyChange > 0.15) return "Il peso non sta scendendo: l’app suggerirà una piccola riduzione delle porzioni energetiche, senza toccare le proteine.";
    return "L’andamento è compatibile con una ricomposizione graduale: mantieni le porzioni attuali.";
  }

  function average(values) {
    const valid = values.filter(Number.isFinite);
    return valid.length ? valid.reduce((sum, value) => sum + value, 0) / valid.length : 0;
  }

  function daysBetween(a, b) {
    return Math.round(Math.abs(new Date(b) - new Date(a)) / 86400000);
  }

  function candidateFoods(group, currentId) {
    const current = foodById.get(currentId);
    return foods
      .filter((food) => food.group === group && food.id !== currentId)
      .sort((a, b) => candidateScore(b, current) - candidateScore(a, current));
  }

  function candidateScore(food, current) {
    const preference = Number(state.preferenceScores[food.id] || 0);
    const kcalDistance = Math.abs(food.kcal - current.kcal);
    const proteinDistance = Math.abs(food.protein - current.protein);
    return preference * 80 - kcalDistance * 0.25 - proteinDistance * 2;
  }

  function openSwap(mealIndex, slotIndex) {
    const currentId = state.meals[mealIndex].slots[slotIndex];
    const current = foodById.get(currentId);
    if (!current) return;
    currentSwap = { mealIndex, slotIndex, currentId };
    document.getElementById("swap-description").textContent = `Alternative a ${current.name}, ordinate usando equivalenza nutrizionale e preferenze apprese.`;
    const options = candidateFoods(current.group, currentId).slice(0, 6);
    document.getElementById("swap-options").innerHTML = options.map((food) => `
      <button class="swap-option" type="button" data-food-choice="${food.id}">
        <span><strong>${food.name}</strong><br><small>${food.portion}</small></span>
        <small>${food.kcal} kcal · ${food.protein} g</small>
      </button>
    `).join("");
    document.querySelectorAll("[data-food-choice]").forEach((button) => {
      button.addEventListener("click", () => chooseFood(button.dataset.foodChoice));
    });
    document.getElementById("swap-dialog").showModal();
  }

  function chooseFood(foodId) {
    if (!currentSwap || !foodById.has(foodId)) return;
    const { mealIndex, slotIndex, currentId } = currentSwap;
    state.meals[mealIndex].slots[slotIndex] = foodId;
    state.preferenceScores[currentId] = Number(state.preferenceScores[currentId] || 0) - 1;
    state.preferenceScores[foodId] = Number(state.preferenceScores[foodId] || 0) + 0.5;
    saveState();
    document.getElementById("swap-dialog").close();
    currentSwap = null;
    renderAll();
    showToast(`${foodById.get(foodId).name} inserito nel piano.`);
  }

  function rateFood(foodId, amount) {
    state.preferenceScores[foodId] = clamp(Number(state.preferenceScores[foodId] || 0) + amount, -6, 6);
    saveState();
    renderAll();
    showToast(`Preferenza salvata per ${foodById.get(foodId).name}.`);
  }

  function dislikeAndReplace(mealIndex, slotIndex) {
    const currentId = state.meals[mealIndex].slots[slotIndex];
    const current = foodById.get(currentId);
    if (!current) return;
    state.preferenceScores[currentId] = clamp(Number(state.preferenceScores[currentId] || 0) - 3, -6, 6);
    const replacement = candidateFoods(current.group, currentId)[0];
    if (replacement) state.meals[mealIndex].slots[slotIndex] = replacement.id;
    saveState();
    renderAll();
    showToast(replacement ? `${current.name} evitato. Provo ${replacement.name}.` : `${current.name} segnato come non gradito.`);
  }

  function renderPreferences() {
    const rated = foods
      .map((food) => ({ ...food, score: Number(state.preferenceScores[food.id] || 0) }))
      .filter((food) => food.score !== 0)
      .sort((a, b) => Math.abs(b.score) - Math.abs(a.score));
    const liked = rated.filter((food) => food.score >= 2).length;
    const disliked = rated.filter((food) => food.score <= -2).length;
    const learned = rated.length;
    document.getElementById("preference-summary").innerHTML = `
      <article class="metric-card"><span>Graditi</span><strong>${liked}</strong><small>priorità alta</small></article>
      <article class="metric-card"><span>Da evitare</span><strong>${disliked}</strong><small>proposti raramente</small></article>
      <article class="metric-card"><span>Segnali appresi</span><strong>${learned}</strong><small>incluse sostituzioni</small></article>
    `;
    const list = rated.length ? rated : foods.slice(0, 8).map((food) => ({ ...food, score: 0 }));
    document.getElementById("preference-list").innerHTML = list.slice(0, 18).map((food) => {
      const positive = food.score >= 0;
      const width = `${Math.max(8, Math.abs(food.score) / 6 * 100)}%`;
      const label = food.score >= 2 ? "Gradito" : food.score <= -2 ? "Da evitare" : "In osservazione";
      return `
        <div class="preference-row">
          <div><strong>${food.name}</strong><br><small>${label} · ${food.tags.join(", ")}</small></div>
          <div class="preference-meter ${positive ? "" : "is-negative"}" aria-label="Preferenza ${food.score}"><span style="--preference-width:${width}"></span></div>
        </div>
      `;
    }).join("");
  }

  function renderPlantOptions() {
    const candidates = foods
      .filter((food) => food.plant)
      .sort((a, b) => Number(state.preferenceScores[b.id] || 0) - Number(state.preferenceScores[a.id] || 0));
    document.getElementById("plant-options").innerHTML = candidates.map((food) => `
      <button class="swap-option" type="button" data-plant-choice="${food.id}">
        <span><strong>${food.name}</strong><br><small>${food.tags.join(" · ")}</small></span>
        <small>${food.portion}</small>
      </button>
    `).join("");
    document.querySelectorAll("[data-plant-choice]").forEach((button) => {
      button.addEventListener("click", () => choosePlantTrial(button.dataset.plantChoice));
    });
  }

  function choosePlantTrial(foodId) {
    const food = foodById.get(foodId);
    if (!food) return;
    state.plantTrial = foodId;
    if (food.group === "plant-side") {
      const lunch = state.meals.find((meal) => meal.id === "lunch");
      const slot = lunch.slots.findIndex((id) => foodById.get(id)?.group === "plant-side");
      if (slot >= 0) lunch.slots[slot] = foodId;
    } else if (food.group === "fruit") {
      const breakfast = state.meals.find((meal) => meal.id === "breakfast");
      const slot = breakfast.slots.findIndex((id) => foodById.get(id)?.group === "fruit");
      if (slot >= 0) breakfast.slots[slot] = foodId;
      else breakfast.slots.push(foodId);
    }
    saveState();
    document.getElementById("plant-dialog").close();
    renderAll();
    showToast(`${food.name}: piccola prova aggiunta. Dopo potrai dire se ti piace.`);
  }

  function renderHealthForm() {
    const h = state.health;
    document.getElementById("sleep-hours").value = h.sleepHours;
    document.getElementById("sleep-baseline").value = h.sleepBaseline;
    document.getElementById("hrv").value = h.hrv;
    document.getElementById("hrv-baseline").value = h.hrvBaseline;
    document.getElementById("resting-hr").value = h.restingHR;
    document.getElementById("resting-hr-baseline").value = h.restingHRBaseline;
    document.getElementById("subjective-energy").value = h.energy;
    document.getElementById("soreness").value = h.soreness;
    document.getElementById("current-weight").value = h.weight || state.profile.weight || "";
    document.getElementById("active-energy").value = h.activeEnergy || "";
    updateRangeOutputs();
  }

  function updateRangeOutputs() {
    document.getElementById("energy-output").textContent = `${document.getElementById("subjective-energy").value}/10`;
    document.getElementById("soreness-output").textContent = `${document.getElementById("soreness").value}/10`;
  }

  function healthFromForm() {
    const form = document.getElementById("health-form");
    const data = new FormData(form);
    return normalizeHealth({
      date: dateKey(),
      sleepHours: data.get("sleepHours"),
      sleepBaseline: data.get("sleepBaseline"),
      hrv: data.get("hrv"),
      hrvBaseline: data.get("hrvBaseline"),
      restingHR: data.get("restingHR"),
      restingHRBaseline: data.get("restingHRBaseline"),
      energy: data.get("energy"),
      soreness: data.get("soreness"),
      activeEnergy: data.get("activeEnergy"),
      weight: data.get("weight"),
      source: "manual"
    });
  }

  function normalizeHealth(input) {
    const required = ["sleepHours", "sleepBaseline", "hrv", "hrvBaseline", "restingHR", "restingHRBaseline", "energy", "soreness", "weight"];
    const normalized = {
      date: typeof input.date === "string" && /^\d{4}-\d{2}-\d{2}$/.test(input.date) ? input.date : dateKey(),
      sleepHours: Number(input.sleepHours),
      sleepBaseline: Number(input.sleepBaseline),
      hrv: Number(input.hrv),
      hrvBaseline: Number(input.hrvBaseline),
      restingHR: Number(input.restingHR),
      restingHRBaseline: Number(input.restingHRBaseline),
      energy: Number(input.energy ?? 6),
      soreness: Number(input.soreness ?? 4),
      activeEnergy: Number(input.activeEnergy ?? 0),
      weight: Number(input.weight),
      source: input.source === "shortcut" ? "shortcut" : input.source === "manual" ? "manual" : "shortcut"
    };
    if (required.some((key) => !Number.isFinite(normalized[key]))) throw new Error("Il file non contiene tutti i valori numerici richiesti.");
    if (normalized.sleepHours < 0 || normalized.sleepHours > 14) throw new Error("Le ore di sonno non sono valide.");
    if (normalized.weight < 30 || normalized.weight > 250) throw new Error("Il peso non è valido.");
    normalized.energy = clamp(normalized.energy, 1, 10);
    normalized.soreness = clamp(normalized.soreness, 1, 10);
    return normalized;
  }

  function storeHealth(health) {
    state.health = health;
    state.profile.weight = health.weight;
    const existing = state.healthHistory.findIndex((entry) => entry.date === health.date);
    const historyEntry = { date: health.date, weight: health.weight, activeEnergy: health.activeEnergy };
    if (existing >= 0) state.healthHistory[existing] = historyEntry;
    else state.healthHistory.push(historyEntry);
    state.healthHistory = state.healthHistory.slice(-60);
    saveState();
    renderAll();
  }

  function formatDecimal(value) {
    return new Intl.NumberFormat("it-IT", { maximumFractionDigits: 1 }).format(value);
  }

  function formatShortDate(dateString) {
    const date = new Date(`${dateString}T12:00:00`);
    return Number.isNaN(date.getTime()) ? "oggi" : new Intl.DateTimeFormat("it-IT", { day: "numeric", month: "short" }).format(date);
  }

  function showToast(message) {
    const toast = document.getElementById("toast");
    toast.textContent = message;
    toast.classList.add("is-visible");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("is-visible"), 2600);
  }

  function renderAll() {
    renderToday();
    renderWeek();
    renderMeals();
    renderPreferences();
    renderHealthForm();
    renderPlantOptions();
  }

  function bindEvents() {
    document.querySelectorAll("[data-route-link]").forEach((control) => {
      control.addEventListener("click", (event) => {
        event.preventDefault();
        navigate(control.dataset.routeLink);
      });
    });

    document.getElementById("today-downgrade").addEventListener("click", () => {
      const todayIndex = getMondayIndex();
      state.easyDays[todayIndex] = true;
      state.selectedDay = todayIndex;
      saveState();
      renderAll();
      showToast("Oggi passa a recupero attivo. Nessun senso di colpa: è parte del piano.");
    });

    document.getElementById("make-easier").addEventListener("click", () => {
      state.easyDays[state.selectedDay] = true;
      saveState();
      renderAll();
      showToast("Seduta alleggerita.");
    });

    document.getElementById("complete-workout").addEventListener("click", () => {
      state.completedDays[state.selectedDay] = true;
      saveState();
      renderAll();
      showToast("Allenamento registrato.");
    });

    document.getElementById("open-plant-lab").addEventListener("click", () => document.getElementById("plant-dialog").showModal());
    document.getElementById("close-plant").addEventListener("click", () => document.getElementById("plant-dialog").close());
    document.getElementById("close-swap").addEventListener("click", () => document.getElementById("swap-dialog").close());

    document.getElementById("reset-preferences").addEventListener("click", () => {
      if (!window.confirm("Vuoi davvero azzerare ciò che l’app ha imparato sui tuoi gusti?")) return;
      state.preferenceScores = clone(defaultState.preferenceScores);
      state.meals = clone(defaultState.meals);
      state.plantTrial = null;
      saveState();
      renderAll();
      showToast("Preferenze azzerate.");
    });

    document.getElementById("subjective-energy").addEventListener("input", updateRangeOutputs);
    document.getElementById("soreness").addEventListener("input", updateRangeOutputs);

    document.getElementById("setup-form").addEventListener("submit", (event) => {
      event.preventDefault();
      const data = new FormData(event.currentTarget);
      const birthDate = String(data.get("birthDate") || "");
      const height = Number(data.get("height"));
      const weight = Number(data.get("weight"));
      const gymMax = Number(data.get("gymMax"));
      const age = calculateAge(birthDate);
      const message = document.getElementById("setup-message");
      if (!Number.isFinite(age) || age < 16 || age > 100) {
        message.textContent = "Controlla la data di nascita.";
        return;
      }
      if (!Number.isFinite(height) || height < 130 || height > 230 || !Number.isFinite(weight) || weight < 30 || weight > 250) {
        message.textContent = "Controlla altezza e peso.";
        return;
      }
      state.profile = { ...state.profile, birthDate, age, height, weight, gymMax: clamp(gymMax, 1, 3) };
      state.health = { ...state.health, date: dateKey(), weight, source: "demo" };
      saveState();
      document.getElementById("setup-dialog").close();
      renderAll();
      showToast("Profilo salvato soltanto su questo dispositivo.");
    });

    document.getElementById("health-form").addEventListener("submit", (event) => {
      event.preventDefault();
      const message = document.getElementById("health-message");
      try {
        const health = healthFromForm();
        storeHealth(health);
        message.textContent = "Dati salvati. Il piano di oggi è stato ricalcolato.";
        navigate("oggi");
      } catch (error) {
        message.textContent = error.message;
      }
    });

    document.getElementById("health-file").addEventListener("change", async (event) => {
      const file = event.target.files?.[0];
      if (!file) return;
      const message = document.getElementById("health-message");
      try {
        const parsed = JSON.parse(await file.text());
        const record = Array.isArray(parsed) ? parsed[parsed.length - 1] : parsed;
        const health = normalizeHealth({ ...record, source: "shortcut" });
        storeHealth(health);
        message.textContent = `Importazione riuscita: ${formatShortDate(health.date)}.`;
        navigate("oggi");
      } catch (error) {
        message.textContent = `Importazione non riuscita: ${error.message}`;
      } finally {
        event.target.value = "";
      }
    });

    window.addEventListener("hashchange", () => navigate(location.hash.slice(1), false));
  }

  function init() {
    state.selectedDay = Number.isInteger(state.selectedDay) ? state.selectedDay : getMondayIndex();
    bindEvents();
    renderAll();
    navigate(location.hash.slice(1) || "oggi", false);
    document.getElementById("setup-birthdate").max = dateKey();
    if (!profileComplete()) document.getElementById("setup-dialog").showModal();
    if ("serviceWorker" in navigator && location.protocol.startsWith("http")) {
      navigator.serviceWorker.register("sw.js").catch(() => {});
    }
  }

  document.addEventListener("DOMContentLoaded", init);
})();
