(() => {
  "use strict";

  const STORAGE_KEY = "forma-personale-v1";
  const SYNC_ENDPOINT = "https://forma-salute-sync.gemini-mario-io.workers.dev/sync";
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

  const workoutAlternatives = [
    {
      id: "bodyweight", short: "Corpo libero", kind: "bodyweight", duration: "30 min", effort: "RPE 5–6",
      exercises: [
        ["Squat a corpo libero", "3 x 12", "Movimento controllato"],
        ["Push-up facilitati o classici", "3 x 8–12", "Lascia due ripetizioni in riserva"],
        ["Affondi indietro", "2 x 8", "Per lato"],
        ["Ponte glutei + plank", "2 x 12 + 25 s", "Chiusura facile"]
      ]
    },
    {
      id: "walk", short: "Camminata veloce", kind: "cardio", duration: "35 min", effort: "RPE 4",
      exercises: [
        ["Partenza facile", "5 min", "Riscaldati gradualmente"],
        ["Passo sostenuto", "25 min", "Devi riuscire a parlare"],
        ["Rallenta", "5 min", "Chiudi senza affanno"]
      ]
    },
    {
      id: "run", short: "Corsa facile", kind: "cardio", duration: "30 min", effort: "RPE 5",
      exercises: [
        ["Camminata iniziale", "5 min", "Riscaldamento"],
        ["Corsa facile", "20 min", "Ritmo conversazionale"],
        ["Defaticamento", "5 min", "Cammina e respira"]
      ]
    },
    {
      id: "basket", short: "Basket", kind: "basket", duration: "45–60 min", effort: "RPE 6–7",
      exercises: [
        ["Riscaldamento dinamico", "10 min", "Caviglie, anche e cambi di direzione"],
        ["Tiro o partitella", "30–40 min", "Regola l’intensità sulle sensazioni"],
        ["Defaticamento", "5 min", "Cammina e respira"]
      ]
    },
    {
      id: "recovery", short: "Recupero attivo", kind: "recovery", duration: "20–30 min", effort: "RPE 2–3",
      exercises: [
        ["Camminata facile", "15–20 min", "Nessun obiettivo di passo"],
        ["Mobilità generale", "8–10 min", "Movimenti senza dolore"]
      ]
    }
  ];

  const defaultWeeklyMeals = [
    [
      { id: "breakfast", name: "Colazione", slots: ["yogurt-greco", "avena", "burro-arachidi"] },
      { id: "lunch", name: "Pranzo", slots: ["pollo", "riso", "passata", "olio"] },
      { id: "snack", name: "Spuntino", slots: ["skyr-spuntino", "pane-spuntino"] },
      { id: "dinner", name: "Cena", slots: ["salmone", "patate", "piselli", "olio"] }
    ],
    [
      { id: "breakfast", name: "Colazione", slots: ["skyr", "cereali-semplici", "mandorle"] },
      { id: "lunch", name: "Pranzo", slots: ["tacchino", "pasta", "passata", "olio"] },
      { id: "snack", name: "Spuntino", slots: ["yogurt-spuntino", "cracker"] },
      { id: "dinner", name: "Cena", slots: ["uova", "pane", "carote", "olio"] }
    ],
    [
      { id: "breakfast", name: "Colazione", slots: ["fiocchi-latte", "pane-colazione", "burro-arachidi"] },
      { id: "lunch", name: "Pranzo", slots: ["manzo-magro", "riso", "zucchine", "olio"] },
      { id: "snack", name: "Spuntino", slots: ["bresaola", "gallette"] },
      { id: "dinner", name: "Cena", slots: ["tonno", "patate", "piselli", "olio"] }
    ],
    [
      { id: "breakfast", name: "Colazione", slots: ["yogurt-greco", "avena", "noci"] },
      { id: "lunch", name: "Pranzo", slots: ["pollo", "couscous", "carote", "olio"] },
      { id: "snack", name: "Spuntino", slots: ["skyr-spuntino", "pane-spuntino"] },
      { id: "dinner", name: "Cena", slots: ["salmone", "pane", "passata", "olio"] }
    ],
    [
      { id: "breakfast", name: "Colazione", slots: ["skyr", "fette-biscottate", "burro-arachidi"] },
      { id: "lunch", name: "Pranzo", slots: ["tacchino", "riso", "passata", "olio"] },
      { id: "snack", name: "Spuntino", slots: ["yogurt-spuntino", "cracker"] },
      { id: "dinner", name: "Cena", slots: ["uova", "patate", "piselli", "olio"] }
    ],
    [
      { id: "breakfast", name: "Colazione", slots: ["ricotta-magra", "cereali-semplici", "mandorle"] },
      { id: "lunch", name: "Pranzo", slots: ["tonno", "piadina", "passata", "olio"] },
      { id: "snack", name: "Spuntino", slots: ["bresaola", "gallette"] },
      { id: "dinner", name: "Cena", slots: ["pollo", "riso", "zucchine", "olio"] }
    ],
    [
      { id: "breakfast", name: "Colazione", slots: ["yogurt-greco", "pane-colazione", "noci"] },
      { id: "lunch", name: "Pranzo", slots: ["manzo-magro", "patate", "carote", "olio"] },
      { id: "snack", name: "Spuntino", slots: ["skyr-spuntino", "pane-spuntino"] },
      { id: "dinner", name: "Cena", slots: ["salmone", "couscous", "piselli", "olio"] }
    ]
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
    sync: {
      token: "",
      lastCheckedAt: null,
      lastImportedAt: null
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
    weeklyMeals: defaultWeeklyMeals,
    selectedMealDay: null,
    completedDays: {},
    completedDates: {},
    easyDays: {},
    workoutOverrides: {},
    activityLog: {},
    selectedDay: 4,
    plantTrial: null
  };

  let state = loadState();
  let currentSwap = null;
  let workoutTargetDay = null;
  let activityTargetDay = null;
  let toastTimer = null;
  let syncInFlight = false;

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function loadState() {
    const fallback = clone(defaultState);
    try {
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY));
      if (!stored || typeof stored !== "object") return fallback;
      const weeklyMeals = Array.isArray(stored.weeklyMeals) && stored.weeklyMeals.length === 7
        ? stored.weeklyMeals
        : clone(fallback.weeklyMeals);
      if (!Array.isArray(stored.weeklyMeals) && Array.isArray(stored.meals)) {
        weeklyMeals[getMondayIndex()] = stored.meals;
      }
      const completedDates = { ...(stored.completedDates || {}) };
      Object.entries(stored.completedDays || {}).forEach(([dayIndex, completed]) => {
        if (completed) completedDates[weekDateKey(Number(dayIndex))] = true;
      });
      return {
        ...fallback,
        ...stored,
        profile: { ...fallback.profile, ...(stored.profile || {}) },
        health: { ...fallback.health, ...(stored.health || {}) },
        sync: { ...fallback.sync, ...(stored.sync || {}) },
        preferenceScores: { ...fallback.preferenceScores, ...(stored.preferenceScores || {}) },
        weeklyMeals,
        healthHistory: Array.isArray(stored.healthHistory) ? stored.healthHistory : [],
        completedDays: stored.completedDays || {},
        completedDates,
        easyDays: stored.easyDays || {},
        workoutOverrides: stored.workoutOverrides || {},
        activityLog: stored.activityLog || {}
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

  function localDateKey(date = new Date()) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  function dateKey() {
    return localDateKey();
  }

  function weekDateKey(dayIndex) {
    const date = new Date();
    date.setHours(12, 0, 0, 0);
    date.setDate(date.getDate() - getMondayIndex(date) + dayIndex);
    return localDateKey(date);
  }

  function mealsForDay(dayIndex = state.selectedMealDay) {
    return state.weeklyMeals[dayIndex] || state.weeklyMeals[getMondayIndex()] || [];
  }

  function parseMinutes(duration) {
    const match = String(duration || "").match(/\d+/);
    return match ? Number(match[0]) : 30;
  }

  function parseRpe(effort) {
    const match = String(effort || "").match(/\d+/);
    return match ? Number(match[0]) : 5;
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

  function plannedWorkout(dayIndex) {
    const override = state.workoutOverrides[weekDateKey(dayIndex)];
    return override ? clone(override) : scheduledDay(dayIndex);
  }

  function applyLoggedActivity(workout, activity) {
    if (!activity) return workout;
    const duration = Number(activity.duration || 0);
    const rpe = Number(activity.rpe || 1);
    const load = duration * rpe;

    if (load >= 180 || rpe >= 7 || duration >= 50) {
      return {
        short: "Recupero post-attività",
        kind: "logged",
        duration: `${duration} min fatti`,
        effort: `RPE ${rpe}`,
        note: `Hai già svolto ${activity.label}. L’attività conta come lavoro della giornata: evita una seconda seduta intensa.`,
        exercises: [
          [activity.label, `${duration} min`, "Attività registrata"],
          ["Camminata o mobilità", "10–15 min facoltativi", "Solo per recuperare"],
          ["Idratazione e pasto regolare", "Oggi", "Supporta il recupero"]
        ],
        loggedActivity: activity
      };
    }

    const reduced = clone(workout);
    reduced.duration = reduced.kind === "rest" ? reduced.duration : "20–30 min opzionali";
    if (!["rest", "recovery"].includes(reduced.kind)) {
      reduced.effort = "RPE ≤ 6";
      reduced.exercises = reduced.exercises.map(([name, dose, cue]) => [name, reduceDose(dose), cue]);
    }
    reduced.note = `Hai già svolto ${activity.label} per ${duration} min a RPE ${rpe}. Se ti senti bene puoi fare la versione breve; altrimenti la giornata è già valida.`;
    reduced.loggedActivity = activity;
    return reduced;
  }

  function adaptedWorkout(dayIndex) {
    const base = plannedWorkout(dayIndex);
    const readiness = calculateReadiness();
    const easy = Boolean(state.easyDays[weekDateKey(dayIndex)] || state.easyDays[dayIndex]);
    const loggedActivity = state.activityLog[weekDateKey(dayIndex)];
    let result;

    if (base.kind === "rest") {
      result = { ...base, note: "Il riposo non viene trasformato automaticamente in allenamento per recuperare sedute saltate." };
    } else if (base.kind === "recovery") {
      result = { ...base, note: "Mantieni questa giornata facile anche se ti senti bene: prepara la seduta successiva." };
    } else if (readiness.mode === "recovery" || easy) {
      result = {
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
    } else if (readiness.mode === "reduced") {
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
      result = base;
    } else {
      base.note = "Recupero buono: programma completo, lasciando comunque due ripetizioni in riserva.";
      result = base;
    }
    return applyLoggedActivity(result, loggedActivity);
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

    const todayActivity = state.activityLog[weekDateKey(todayIndex)];
    const activitySummary = document.getElementById("today-activity-summary");
    activitySummary.hidden = !todayActivity;
    activitySummary.innerHTML = todayActivity ? `
      <div>
        <p class="eyebrow">Attività considerata oggi</p>
        <strong>${todayActivity.label}</strong>
        <span>${todayActivity.duration} min · RPE ${todayActivity.rpe}</span>
      </div>
      <button class="text-button" type="button" id="edit-today-activity">Modifica</button>
    ` : "";
    document.getElementById("edit-today-activity")?.addEventListener("click", () => openActivityDialog(todayIndex));

    const syncButton = document.getElementById("quick-sync");
    syncButton.classList.toggle("has-data", !sourceIsDemo);
    document.getElementById("sync-label").textContent = sourceIsDemo ? "Dati demo" : `Aggiornato ${formatShortDate(h.date)}`;
    document.getElementById("data-mode-pill").textContent = sourceIsDemo
      ? "Demo"
      : h.source === "cloud"
        ? "Automatico"
        : h.source === "shortcut"
          ? "Importato"
          : "Manuale";

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
      const scheduled = plannedWorkout(index);
      const activity = state.activityLog[weekDateKey(index)];
      const button = document.createElement("button");
      button.type = "button";
      button.className = "day-button";
      if (index === state.selectedDay) button.classList.add("is-selected");
      if (state.completedDates[weekDateKey(index)] || activity) button.classList.add("is-complete");
      button.setAttribute("aria-pressed", String(index === state.selectedDay));
      button.innerHTML = `<strong>${shortDayNames[index]}</strong><span>${activity ? activity.label : scheduled.short}</span><small>${activity ? `${activity.duration} min` : scheduled.duration}</small>`;
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
    const complete = Boolean(state.completedDates[weekDateKey(state.selectedDay)] || state.activityLog[weekDateKey(state.selectedDay)]);
    completeButton.textContent = complete ? "Attività registrata" : "Segna come completato";
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

  function planTotals(meals = mealsForDay()) {
    return meals.reduce((total, meal) => {
      const mealTotal = mealTotals(meal);
      total.kcal += mealTotal.kcal;
      total.protein += mealTotal.protein;
      return total;
    }, { kcal: 0, protein: 0 });
  }

  function weeklyAverageTotals() {
    const totals = state.weeklyMeals.map((meals) => planTotals(meals));
    return {
      kcal: Math.round(average(totals.map((item) => item.kcal))),
      protein: Math.round(average(totals.map((item) => item.protein)))
    };
  }

  function renderMealWeekStrip() {
    const strip = document.getElementById("meal-week-strip");
    strip.innerHTML = state.weeklyMeals.map((meals, index) => {
      const totals = planTotals(meals);
      return `
        <button class="meal-day-button ${index === state.selectedMealDay ? "is-selected" : ""}" type="button" data-meal-day="${index}" aria-pressed="${index === state.selectedMealDay}">
          <strong>${shortDayNames[index]}</strong>
          <small>${totals.kcal} kcal</small>
        </button>
      `;
    }).join("");
    strip.querySelectorAll("[data-meal-day]").forEach((button) => {
      button.addEventListener("click", () => {
        state.selectedMealDay = Number(button.dataset.mealDay);
        saveState();
        renderMeals();
      });
    });
  }

  function renderGroceryList() {
    const counts = new Map();
    state.weeklyMeals.flat().forEach((meal) => {
      meal.slots.forEach((foodId) => {
        const food = foodById.get(foodId);
        if (!food) return;
        const current = counts.get(foodId) || { food, count: 0 };
        current.count += 1;
        counts.set(foodId, current);
      });
    });
    const groupLabels = {
      "dairy-protein": "Colazioni proteiche",
      "breakfast-carb": "Cereali e pane da colazione",
      "main-protein": "Carne, pesce, uova e alternative",
      "main-carb": "Riso, pasta, pane e patate",
      "snack-protein": "Proteine per spuntini",
      "snack-carb": "Carboidrati per spuntini",
      "plant-side": "Verdure e legumi",
      fruit: "Frutta",
      fat: "Condimenti e frutta secca"
    };
    const groupOrder = ["main-protein", "dairy-protein", "snack-protein", "main-carb", "breakfast-carb", "snack-carb", "plant-side", "fruit", "fat"];
    document.getElementById("grocery-list").innerHTML = groupOrder.map((group) => {
      const items = [...counts.values()].filter(({ food }) => food.group === group);
      if (!items.length) return "";
      return `
        <section class="grocery-group">
          <h3>${groupLabels[group]}</h3>
          ${items.map(({ food, count }) => `
            <div class="grocery-row"><strong>${food.name}</strong><span>${count} × ${food.portion}</span></div>
          `).join("")}
        </section>
      `;
    }).join("");
  }

  function renderMeals() {
    const container = document.getElementById("meal-plan");
    const meals = mealsForDay();
    renderMealWeekStrip();
    container.innerHTML = meals.map((meal, mealIndex) => {
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

    const totals = planTotals(meals);
    const weeklyAverage = weeklyAverageTotals();
    document.getElementById("meal-day-title").textContent = dayNames[state.selectedMealDay];
    document.getElementById("meal-day-total").textContent = `${totals.kcal} kcal · ${totals.protein} g proteine`;
    document.getElementById("plan-calories").textContent = `≈ ${weeklyAverage.kcal} kcal`;
    const historyDays = new Set(state.healthHistory.map((entry) => entry.date)).size;
    document.getElementById("nutrition-summary").textContent = historyDays >= 14
      ? nutritionCalibrationText()
      : `Media settimanale ≈ ${weeklyAverage.kcal} kcal al giorno. Servono ancora ${Math.max(0, 14 - historyDays)} giorni di peso e attività per calibrare le porzioni.`;
    document.getElementById("plant-step-label").textContent = state.plantTrial ? "1 scelta" : "1 prova";
    renderGroceryList();
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
    const meals = mealsForDay();
    const currentId = meals[mealIndex].slots[slotIndex];
    const current = foodById.get(currentId);
    if (!current) return;
    currentSwap = { dayIndex: state.selectedMealDay, mealIndex, slotIndex, currentId };
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
    const { dayIndex, mealIndex, slotIndex, currentId } = currentSwap;
    state.weeklyMeals[dayIndex][mealIndex].slots[slotIndex] = foodId;
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
    const meals = mealsForDay();
    const currentId = meals[mealIndex].slots[slotIndex];
    const current = foodById.get(currentId);
    if (!current) return;
    state.preferenceScores[currentId] = clamp(Number(state.preferenceScores[currentId] || 0) - 3, -6, 6);
    const replacement = candidateFoods(current.group, currentId)[0];
    if (replacement) meals[mealIndex].slots[slotIndex] = replacement.id;
    saveState();
    renderAll();
    showToast(replacement ? `${current.name} evitato. Provo ${replacement.name}.` : `${current.name} segnato come non gradito.`);
  }

  function openWorkoutChoice(dayIndex) {
    workoutTargetDay = dayIndex;
    const current = plannedWorkout(dayIndex);
    document.getElementById("workout-choice-description").textContent = `Al posto di ${current.short}, scegli ciò che puoi fare. Forma applicherà comunque le regole di recupero della giornata.`;
    document.getElementById("workout-choice-options").innerHTML = workoutAlternatives.map((option) => `
      <button class="swap-option" type="button" data-workout-choice="${option.id}">
        <span><strong>${option.short}</strong><br><small>${option.duration}</small></span>
        <small>${option.effort}</small>
      </button>
    `).join("");
    document.querySelectorAll("[data-workout-choice]").forEach((button) => {
      button.addEventListener("click", () => chooseWorkoutAlternative(button.dataset.workoutChoice));
    });
    document.getElementById("restore-workout").hidden = !state.workoutOverrides[weekDateKey(dayIndex)];
    document.getElementById("workout-choice-dialog").showModal();
  }

  function chooseWorkoutAlternative(optionId) {
    if (workoutTargetDay === null) return;
    const option = workoutAlternatives.find((item) => item.id === optionId);
    if (!option) return;
    state.workoutOverrides[weekDateKey(workoutTargetDay)] = clone(option);
    state.selectedDay = workoutTargetDay;
    delete state.easyDays[workoutTargetDay];
    delete state.easyDays[weekDateKey(workoutTargetDay)];
    saveState();
    document.getElementById("workout-choice-dialog").close();
    renderAll();
    showToast(`${option.short} inserito al posto dell’allenamento previsto.`);
  }

  function restoreWorkout(dayIndex) {
    delete state.workoutOverrides[weekDateKey(dayIndex)];
    saveState();
    document.getElementById("workout-choice-dialog").close();
    renderAll();
    showToast("Programma originale ripristinato.");
  }

  function activityLabel(type) {
    return {
      gym: "Palestra",
      bodyweight: "Corpo libero",
      run: "Corsa",
      walk: "Camminata",
      basket: "Basket",
      other: "Altro sport"
    }[type] || "Attività personale";
  }

  function openActivityDialog(dayIndex) {
    activityTargetDay = dayIndex;
    const form = document.getElementById("activity-form");
    const existing = state.activityLog[weekDateKey(dayIndex)];
    form.reset();
    form.elements.activityType.value = existing?.type || "bodyweight";
    form.elements.duration.value = existing?.duration || 30;
    form.elements.rpe.value = existing?.rpe || 6;
    document.getElementById("activity-rpe-output").textContent = `${form.elements.rpe.value}/10`;
    document.getElementById("remove-activity").hidden = !existing;
    document.getElementById("activity-message").textContent = "";
    document.getElementById("activity-dialog").showModal();
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
    const meals = mealsForDay();
    if (food.group === "plant-side") {
      const lunch = meals.find((meal) => meal.id === "lunch");
      const slot = lunch.slots.findIndex((id) => foodById.get(id)?.group === "plant-side");
      if (slot >= 0) lunch.slots[slot] = foodId;
    } else if (food.group === "fruit") {
      const breakfast = meals.find((meal) => meal.id === "breakfast");
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
      source: input.source === "cloud"
        ? "cloud"
        : input.source === "shortcut"
          ? "shortcut"
          : input.source === "manual"
            ? "manual"
            : "shortcut"
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

  function formatSyncTime(isoString) {
    if (!isoString) return "";
    const date = new Date(isoString);
    if (Number.isNaN(date.getTime())) return "";
    return new Intl.DateTimeFormat("it-IT", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit"
    }).format(date);
  }

  function renderSyncSettings() {
    const configured = Boolean(state.sync.token);
    const status = document.getElementById("cloud-sync-status");
    const description = document.getElementById("cloud-sync-description");
    const tokenInput = document.getElementById("sync-token");
    const syncButton = document.getElementById("sync-now");
    const forgetButton = document.getElementById("forget-sync-token");
    if (!status || !description || !tokenInput || !syncButton || !forgetButton) return;

    status.textContent = syncInFlight
      ? "Controllo…"
      : !configured
        ? "Da collegare"
        : state.sync.lastImportedAt
          ? "Attivo"
          : "Collegato";
    description.textContent = !configured
      ? "Inserisci una sola volta la chiave privata: Forma controllerà i nuovi dati quando apri l’app."
      : state.sync.lastImportedAt
        ? `Ultimo import automatico: ${formatSyncTime(state.sync.lastImportedAt)}.`
        : state.sync.lastCheckedAt
          ? `Collegamento verificato: ${formatSyncTime(state.sync.lastCheckedAt)}. In attesa di nuovi dati.`
          : "Chiave salvata su questo dispositivo. Il controllo automatico è attivo.";
    tokenInput.placeholder = configured ? "Chiave già salvata — inseriscine una nuova per cambiarla" : "Incolla qui la chiave di 64 caratteri";
    syncButton.disabled = !configured || syncInFlight;
    forgetButton.disabled = !configured || syncInFlight;
    document.getElementById("save-sync-token").disabled = syncInFlight;
  }

  function setSyncMessage(message) {
    const element = document.getElementById("sync-message");
    if (element) element.textContent = message;
  }

  async function syncHealthFromCloud({ silent = false } = {}) {
    if (!state.sync.token) {
      navigate("dati");
      setSyncMessage("Inserisci prima la chiave privata.");
      document.getElementById("sync-token")?.focus();
      return false;
    }
    if (syncInFlight) return false;

    syncInFlight = true;
    renderSyncSettings();
    const headers = { Authorization: `Bearer ${state.sync.token}` };

    try {
      const response = await fetch(SYNC_ENDPOINT, { method: "GET", headers, cache: "no-store" });
      state.sync.lastCheckedAt = new Date().toISOString();
      saveState();

      if (response.status === 404) {
        if (!silent) setSyncMessage("Collegamento attivo. Non ci sono ancora nuovi dati da importare.");
        return false;
      }
      if (response.status === 401) throw new Error("La chiave privata non è corretta.");
      if (!response.ok) throw new Error("Il servizio non è disponibile in questo momento.");

      const payload = await response.json();
      if (!payload?.data || typeof payload.data !== "object") throw new Error("Il pacchetto ricevuto non è valido.");
      const health = normalizeHealth({
        ...state.health,
        ...payload.data,
        date: payload.data.date || dateKey(),
        source: "cloud"
      });
      storeHealth(health);

      const deleted = await fetch(SYNC_ENDPOINT, { method: "DELETE", headers, cache: "no-store" });
      state.sync.lastImportedAt = new Date().toISOString();
      saveState();
      renderAll();

      const message = deleted.ok
        ? `Dati importati automaticamente: ${formatShortDate(health.date)}.`
        : `Dati importati: ${formatShortDate(health.date)}. La copia temporanea scadrà automaticamente.`;
      setSyncMessage(message);
      if (!silent) showToast("Nuovi dati Salute importati e piano aggiornato.");
      return true;
    } catch (error) {
      setSyncMessage(`Sincronizzazione non riuscita: ${error.message}`);
      if (!silent) showToast("Non sono riuscito a sincronizzare i dati.");
      return false;
    } finally {
      syncInFlight = false;
      renderSyncSettings();
    }
  }

  function syncCheckIsDue() {
    if (!state.sync.token || !state.sync.lastCheckedAt) return Boolean(state.sync.token);
    const checkedAt = new Date(state.sync.lastCheckedAt).getTime();
    return !Number.isFinite(checkedAt) || Date.now() - checkedAt > 5 * 60 * 1000;
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
    renderSyncSettings();
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
      state.easyDays[weekDateKey(todayIndex)] = true;
      state.selectedDay = todayIndex;
      saveState();
      renderAll();
      showToast("Oggi passa a recupero attivo. Nessun senso di colpa: è parte del piano.");
    });

    document.getElementById("today-change-workout").addEventListener("click", () => openWorkoutChoice(getMondayIndex()));
    document.getElementById("today-log-activity").addEventListener("click", () => openActivityDialog(getMondayIndex()));
    document.getElementById("change-workout").addEventListener("click", () => openWorkoutChoice(state.selectedDay));
    document.getElementById("log-activity").addEventListener("click", () => openActivityDialog(state.selectedDay));
    document.getElementById("close-workout-choice").addEventListener("click", () => document.getElementById("workout-choice-dialog").close());
    document.getElementById("restore-workout").addEventListener("click", () => {
      if (workoutTargetDay !== null) restoreWorkout(workoutTargetDay);
    });
    document.getElementById("close-activity").addEventListener("click", () => document.getElementById("activity-dialog").close());
    document.getElementById("activity-rpe").addEventListener("input", (event) => {
      document.getElementById("activity-rpe-output").textContent = `${event.target.value}/10`;
    });

    document.getElementById("activity-form").addEventListener("submit", (event) => {
      event.preventDefault();
      if (activityTargetDay === null) return;
      const data = new FormData(event.currentTarget);
      const type = String(data.get("activityType"));
      const duration = Number(data.get("duration"));
      const rpe = Number(data.get("rpe"));
      if (!Number.isFinite(duration) || duration < 5 || duration > 240 || !Number.isFinite(rpe) || rpe < 1 || rpe > 10) {
        document.getElementById("activity-message").textContent = "Controlla durata e intensità.";
        return;
      }
      const key = weekDateKey(activityTargetDay);
      state.activityLog[key] = { type, label: activityLabel(type), duration, rpe, recordedAt: new Date().toISOString() };
      state.completedDates[key] = true;
      state.selectedDay = activityTargetDay;
      saveState();
      document.getElementById("activity-dialog").close();
      renderAll();
      showToast("Attività registrata e programma della giornata ricalcolato.");
    });

    document.getElementById("remove-activity").addEventListener("click", () => {
      if (activityTargetDay === null) return;
      const key = weekDateKey(activityTargetDay);
      delete state.activityLog[key];
      delete state.completedDates[key];
      delete state.completedDays[activityTargetDay];
      saveState();
      document.getElementById("activity-dialog").close();
      renderAll();
      showToast("Attività registrata rimossa.");
    });

    document.getElementById("make-easier").addEventListener("click", () => {
      state.easyDays[weekDateKey(state.selectedDay)] = true;
      saveState();
      renderAll();
      showToast("Seduta alleggerita.");
    });

    document.getElementById("complete-workout").addEventListener("click", () => {
      const key = weekDateKey(state.selectedDay);
      const workout = plannedWorkout(state.selectedDay);
      state.completedDates[key] = true;
      state.activityLog[key] = {
        type: workout.kind,
        label: workout.short,
        duration: parseMinutes(workout.duration),
        rpe: parseRpe(workout.effort),
        planned: true,
        recordedAt: new Date().toISOString()
      };
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
      state.weeklyMeals = clone(defaultState.weeklyMeals);
      state.plantTrial = null;
      saveState();
      renderAll();
      showToast("Preferenze azzerate.");
    });

    document.getElementById("subjective-energy").addEventListener("input", updateRangeOutputs);
    document.getElementById("soreness").addEventListener("input", updateRangeOutputs);

    document.getElementById("quick-sync").addEventListener("click", () => {
      if (!state.sync.token) {
        navigate("dati");
        setSyncMessage("Inserisci la chiave privata per attivare il collegamento automatico.");
        setTimeout(() => document.getElementById("sync-token")?.focus(), 0);
        return;
      }
      syncHealthFromCloud();
    });

    document.getElementById("save-sync-token").addEventListener("click", async () => {
      const input = document.getElementById("sync-token");
      const token = input.value.trim().toLowerCase();
      if (!token && state.sync.token) {
        setSyncMessage("La chiave è già salvata su questo dispositivo.");
        return;
      }
      if (!/^[a-f0-9]{64}$/.test(token)) {
        setSyncMessage("La chiave deve contenere esattamente 64 lettere e numeri.");
        input.focus();
        return;
      }
      state.sync.token = token;
      state.sync.lastCheckedAt = null;
      state.sync.lastImportedAt = null;
      saveState();
      input.value = "";
      renderSyncSettings();
      setSyncMessage("Chiave salvata. Controllo subito il collegamento…");
      await syncHealthFromCloud();
    });

    document.getElementById("sync-now").addEventListener("click", () => syncHealthFromCloud());

    document.getElementById("forget-sync-token").addEventListener("click", async () => {
      if (!state.sync.token || !window.confirm("Vuoi rimuovere la chiave da questo dispositivo?")) return;
      const oldToken = state.sync.token;
      state.sync = clone(defaultState.sync);
      saveState();
      renderSyncSettings();
      setSyncMessage("Chiave rimossa. La sincronizzazione automatica è disattivata.");
      try {
        await fetch(SYNC_ENDPOINT, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${oldToken}` },
          cache: "no-store"
        });
      } catch (error) {
        // La copia temporanea scade comunque entro sette giorni.
      }
    });

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
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "visible" && syncCheckIsDue()) syncHealthFromCloud({ silent: true });
    });
  }

  function init() {
    state.selectedDay = Number.isInteger(state.selectedDay) ? state.selectedDay : getMondayIndex();
    state.selectedMealDay = Number.isInteger(state.selectedMealDay) ? state.selectedMealDay : getMondayIndex();
    bindEvents();
    renderAll();
    navigate(location.hash.slice(1) || "oggi", false);
    document.getElementById("setup-birthdate").max = dateKey();
    if (!profileComplete()) document.getElementById("setup-dialog").showModal();
    if ("serviceWorker" in navigator && location.protocol.startsWith("http")) {
      navigator.serviceWorker.register("sw.js").catch(() => {});
    }
    if (syncCheckIsDue()) syncHealthFromCloud({ silent: true });
  }

  document.addEventListener("DOMContentLoaded", init);
})();
