const ALLOWED_ORIGIN = "https://mariocapobi.github.io";

const corsHeaders = () => ({
  "access-control-allow-origin": ALLOWED_ORIGIN,
  "access-control-allow-methods": "GET,POST,DELETE,OPTIONS",
  "access-control-allow-headers": "authorization,content-type",
  "cache-control": "no-store",
  "vary": "Origin"
});

const json = (body, status = 200) => new Response(JSON.stringify(body), {
  status,
  headers: {
    "content-type": "application/json; charset=utf-8",
    ...corsHeaders()
  }
});

const fields = {
  sleepHours: { aliases: ["sleepHours", "sleep"], min: 0, max: 16 },
  sleepBaseline: { aliases: ["sleepBaseline"], min: 1, max: 16 },
  hrv: { aliases: ["hrv"], min: 0, max: 300 },
  hrvBaseline: { aliases: ["hrvBaseline"], min: 1, max: 300 },
  restingHR: { aliases: ["restingHR", "restingHr"], min: 25, max: 180 },
  restingHRBaseline: { aliases: ["restingHRBaseline"], min: 25, max: 180 },
  energy: { aliases: ["energy"], min: 1, max: 10 },
  soreness: { aliases: ["soreness"], min: 1, max: 10 },
  weight: { aliases: ["weight"], min: 35, max: 250 },
  activeEnergy: { aliases: ["activeEnergy", "activeCalories"], min: 0, max: 10000 },
  steps: { aliases: ["steps"], min: 0, max: 100000 },
  exerciseMinutes: { aliases: ["exerciseMinutes"], min: 0, max: 1440 },
  standHours: { aliases: ["standHours"], min: 0, max: 24 },
  workoutMinutes: { aliases: ["workoutMinutes"], min: 0, max: 1440 }
};

function cleanPayload(data) {
  const clean = {};
  for (const [outputKey, rule] of Object.entries(fields)) {
    const inputKey = rule.aliases.find((key) => data[key] !== undefined && data[key] !== null && data[key] !== "");
    if (!inputKey) continue;
    const value = Number(data[inputKey]);
    if (!Number.isFinite(value) || value < rule.min || value > rule.max) {
      throw new Error(`invalid_${outputKey}`);
    }
    clean[outputKey] = value;
  }
  if (typeof data.date === "string" && /^\d{4}-\d{2}-\d{2}$/.test(data.date)) clean.date = data.date;
  return clean;
}

export default {
  async fetch(request, env) {
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeaders() });
    }

    if (request.headers.get("Authorization") !== `Bearer ${env.SYNC_TOKEN}`) {
      return json({ error: "unauthorized" }, 401);
    }

    const url = new URL(request.url);
    if (url.pathname !== "/sync") return json({ error: "not_found" }, 404);

    if (request.method === "POST") {
      const contentType = (request.headers.get("content-type") || "").split(";")[0];
      if (contentType !== "application/json") return json({ error: "json_required" }, 415);

      const text = await request.text();
      if (text.length > 12000) return json({ error: "too_large" }, 413);

      let data;
      try {
        data = JSON.parse(text);
      } catch {
        return json({ error: "invalid_json" }, 400);
      }
      if (!data || typeof data !== "object" || Array.isArray(data)) {
        return json({ error: "invalid_payload" }, 400);
      }

      let clean;
      try {
        clean = cleanPayload(data);
      } catch (error) {
        return json({ error: error.message }, 400);
      }
      if (Object.keys(clean).every((key) => key === "date")) {
        return json({ error: "empty_payload" }, 400);
      }

      await env.FORMA_DATA.put(
        "latest",
        JSON.stringify({ data: clean, receivedAt: new Date().toISOString() }),
        { expirationTtl: 604800 }
      );
      return json({ ok: true }, 202);
    }

    if (request.method === "GET") {
      const payload = await env.FORMA_DATA.get("latest");
      if (!payload) return json({ empty: true }, 404);
      return new Response(payload, {
        status: 200,
        headers: {
          "content-type": "application/json; charset=utf-8",
          ...corsHeaders()
        }
      });
    }

    if (request.method === "DELETE") {
      await env.FORMA_DATA.delete("latest");
      return json({ ok: true });
    }

    return json({ error: "method_not_allowed" }, 405);
  }
};
