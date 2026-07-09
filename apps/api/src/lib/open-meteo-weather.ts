/**
 * Open-Meteo geocoding + forecast (no API key). Server-only.
 */

export type WeatherCondition =
  | "Clear"
  | "Partly Cloudy"
  | "Cloudy"
  | "Rain"
  | "Storms"
  | "Windy"
  | "Hot";

export type RiskBand = "Low" | "Moderate" | "High" | "Severe";

export type WeatherDay = {
  label: string;
  condition: WeatherCondition;
  high: number;
  low: number;
  rainRisk: number;
  windMph: number;
};

export type LiveWeatherSnapshot = {
  forecast: WeatherDay[];
  rainRisk: RiskBand;
  windRisk: RiskBand;
  heatRisk: RiskBand;
  recommendation: string;
};

const US_STATE_NAMES: Record<string, string> = {
  AL: "Alabama",
  AK: "Alaska",
  AZ: "Arizona",
  AR: "Arkansas",
  CA: "California",
  CO: "Colorado",
  CT: "Connecticut",
  DE: "Delaware",
  FL: "Florida",
  GA: "Georgia",
  HI: "Hawaii",
  ID: "Idaho",
  IL: "Illinois",
  IN: "Indiana",
  IA: "Iowa",
  KS: "Kansas",
  KY: "Kentucky",
  LA: "Louisiana",
  ME: "Maine",
  MD: "Maryland",
  MA: "Massachusetts",
  MI: "Michigan",
  MN: "Minnesota",
  MS: "Mississippi",
  MO: "Missouri",
  MT: "Montana",
  NE: "Nebraska",
  NV: "Nevada",
  NH: "New Hampshire",
  NJ: "New Jersey",
  NM: "New Mexico",
  NY: "New York",
  NC: "North Carolina",
  ND: "North Dakota",
  OH: "Ohio",
  OK: "Oklahoma",
  OR: "Oregon",
  PA: "Pennsylvania",
  RI: "Rhode Island",
  SC: "South Carolina",
  SD: "South Dakota",
  TN: "Tennessee",
  TX: "Texas",
  UT: "Utah",
  VT: "Vermont",
  VA: "Virginia",
  WA: "Washington",
  WV: "West Virginia",
  WI: "Wisconsin",
  WY: "Wyoming",
  DC: "District of Columbia",
};

const FETCH_TIMEOUT_MS = 8_000;
const CACHE_TTL_MS = 30 * 60_000;

type GeoResult = { latitude: number; longitude: number; admin1?: string; country_code?: string };
type CacheEntry<T> = { value: T; expiresAt: number };

const geoCache = new Map<string, CacheEntry<{ lat: number; lon: number } | null>>();
const forecastCache = new Map<string, CacheEntry<LiveWeatherSnapshot | null>>();

function cacheGet<T>(map: Map<string, CacheEntry<T>>, key: string): T | undefined {
  const hit = map.get(key);
  if (!hit) return undefined;
  if (Date.now() > hit.expiresAt) {
    map.delete(key);
    return undefined;
  }
  return hit.value;
}

function cacheSet<T>(map: Map<string, CacheEntry<T>>, key: string, value: T) {
  map.set(key, { value, expiresAt: Date.now() + CACHE_TTL_MS });
}

/** Parse "City, ST" from a jobsite location string. */
export function parseCityStateFromLocation(
  location: string
): { city: string; state: string } | null {
  const trimmed = location.trim();
  if (!trimmed) return null;
  const match = trimmed.match(/^(.+?),\s*([A-Za-z]{2})\b/);
  if (match) {
    return { city: match[1].trim(), state: match[2].toUpperCase() };
  }
  return { city: trimmed, state: "" };
}

export function resolveGeoQuery(
  location: string | null | undefined,
  payload: Record<string, unknown>
): string | null {
  const city = String(payload.city ?? payload.siteCity ?? "").trim();
  const state = String(payload.state ?? payload.siteState ?? payload.stateCode ?? "").trim();
  if (city) {
    return state ? `${city}, ${state.toUpperCase()}` : city;
  }
  const parsed = location ? parseCityStateFromLocation(location) : null;
  if (!parsed) return location?.trim() || null;
  return parsed.state ? `${parsed.city}, ${parsed.state}` : parsed.city;
}

function weatherCodeToCondition(code: number, high: number, windMph: number): WeatherCondition {
  if (high >= 95) return "Hot";
  if (windMph >= 25 && code <= 3) return "Windy";
  if (code === 0) return "Clear";
  if (code === 1 || code === 2) return "Partly Cloudy";
  if (code === 3) return "Cloudy";
  if (code >= 95) return "Storms";
  if (code >= 80 || (code >= 61 && code <= 67) || (code >= 51 && code <= 57)) return "Rain";
  return "Partly Cloudy";
}

function rainBandFromPct(pct: number): RiskBand {
  if (pct >= 80) return "Severe";
  if (pct >= 60) return "High";
  if (pct >= 30) return "Moderate";
  return "Low";
}

function windBandFromMph(mph: number): RiskBand {
  if (mph >= 35) return "Severe";
  if (mph >= 25) return "High";
  if (mph >= 15) return "Moderate";
  return "Low";
}

function heatBandFromHigh(high: number): RiskBand {
  if (high >= 100) return "Severe";
  if (high >= 95) return "High";
  if (high >= 85) return "Moderate";
  return "Low";
}

function formatDayLabel(isoDate: string, index: number): string {
  if (index === 0) return "Today";
  const d = new Date(`${isoDate}T12:00:00`);
  return d.toLocaleDateString("en-US", { weekday: "short" });
}

function buildRecommendation(forecast: WeatherDay[]): string {
  const worstRain = forecast.reduce(
    (best, day) => (day.rainRisk > best.rainRisk ? day : best),
    forecast[0]
  );
  const worstWind = forecast.reduce(
    (best, day) => (day.windMph > best.windMph ? day : best),
    forecast[0]
  );
  const hottest = forecast.reduce(
    (best, day) => (day.high > best.high ? day : best),
    forecast[0]
  );

  const parts: string[] = [];
  if (worstRain.rainRisk >= 60) {
    parts.push(
      `${worstRain.label} shows ${worstRain.rainRisk}% rain chance — shift weather-sensitive work to a clearer window.`
    );
  }
  if (worstWind.windMph >= 25) {
    parts.push(
      `${worstWind.label} gusts to ${worstWind.windMph} mph — confirm crane and rooftop work go/no-go.`
    );
  }
  if (hottest.high >= 95) {
    parts.push(`${hottest.label} high ${hottest.high}°F — plan hydration breaks and heat exposure limits.`);
  }
  if (parts.length === 0) {
    return "Five-day Open-Meteo outlook looks workable. Verify field conditions before mobilizing crews.";
  }
  return parts.join(" ");
}

async function geocodeQuery(query: string): Promise<{ lat: number; lon: number } | null> {
  const cached = cacheGet(geoCache, query);
  if (cached !== undefined) return cached;

  const url = new URL("https://geocoding-api.open-meteo.com/v1/search");
  url.searchParams.set("name", query);
  url.searchParams.set("count", "5");
  url.searchParams.set("language", "en");
  url.searchParams.set("format", "json");
  url.searchParams.set("countryCode", "US");

  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(FETCH_TIMEOUT_MS) });
    if (!res.ok) {
      cacheSet(geoCache, query, null);
      return null;
    }
    const data = (await res.json()) as { results?: GeoResult[] };
    const results = data.results ?? [];
    if (results.length === 0) {
      cacheSet(geoCache, query, null);
      return null;
    }

    const parsed = parseCityStateFromLocation(query);
    let pick = results[0]!;
    if (parsed?.state) {
      const stateName = US_STATE_NAMES[parsed.state]?.toLowerCase();
      const stateMatch = results.find(
        (r) =>
          r.country_code === "US" &&
          stateName &&
          r.admin1?.toLowerCase().includes(stateName)
      );
      if (stateMatch) pick = stateMatch;
      else {
        const us = results.find((r) => r.country_code === "US");
        if (us) pick = us;
      }
    }

    const coords = { lat: pick.latitude, lon: pick.longitude };
    cacheSet(geoCache, query, coords);
    return coords;
  } catch {
    cacheSet(geoCache, query, null);
    return null;
  }
}

async function fetchForecast(lat: number, lon: number): Promise<LiveWeatherSnapshot | null> {
  const key = `${lat.toFixed(3)},${lon.toFixed(3)}`;
  const cached = cacheGet(forecastCache, key);
  if (cached !== undefined) return cached;

  const url = new URL("https://api.open-meteo.com/v1/forecast");
  url.searchParams.set("latitude", String(lat));
  url.searchParams.set("longitude", String(lon));
  url.searchParams.set(
    "daily",
    "weathercode,temperature_2m_max,temperature_2m_min,precipitation_probability_max,wind_speed_10m_max"
  );
  url.searchParams.set("temperature_unit", "fahrenheit");
  url.searchParams.set("wind_speed_unit", "mph");
  url.searchParams.set("timezone", "auto");
  url.searchParams.set("forecast_days", "5");

  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(FETCH_TIMEOUT_MS) });
    if (!res.ok) {
      cacheSet(forecastCache, key, null);
      return null;
    }
    const data = (await res.json()) as {
      daily?: {
        time?: string[];
        weathercode?: number[];
        temperature_2m_max?: number[];
        temperature_2m_min?: number[];
        precipitation_probability_max?: number[];
        wind_speed_10m_max?: number[];
      };
    };
    const daily = data.daily;
    const times = daily?.time ?? [];
    if (times.length === 0) {
      cacheSet(forecastCache, key, null);
      return null;
    }

    const forecast: WeatherDay[] = times.slice(0, 5).map((iso, i) => {
      const high = Math.round(daily?.temperature_2m_max?.[i] ?? 70);
      const low = Math.round(daily?.temperature_2m_min?.[i] ?? 60);
      const rainRisk = Math.round(daily?.precipitation_probability_max?.[i] ?? 0);
      const windMph = Math.round(daily?.wind_speed_10m_max?.[i] ?? 0);
      const code = daily?.weathercode?.[i] ?? 1;
      return {
        label: formatDayLabel(iso, i),
        condition: weatherCodeToCondition(code, high, windMph),
        high,
        low,
        rainRisk,
        windMph,
      };
    });

    const maxRain = Math.max(...forecast.map((d) => d.rainRisk));
    const maxWind = Math.max(...forecast.map((d) => d.windMph));
    const maxHeat = Math.max(...forecast.map((d) => d.high));

    const snapshot: LiveWeatherSnapshot = {
      forecast,
      rainRisk: rainBandFromPct(maxRain),
      windRisk: windBandFromMph(maxWind),
      heatRisk: heatBandFromHigh(maxHeat),
      recommendation: buildRecommendation(forecast),
    };
    cacheSet(forecastCache, key, snapshot);
    return snapshot;
  } catch {
    cacheSet(forecastCache, key, null);
    return null;
  }
}

/** Geocode jobsite city/state and return a 5-day forecast, or null on failure. */
export async function fetchLiveWeatherForJobsite(
  location: string | null | undefined,
  payload: Record<string, unknown>
): Promise<LiveWeatherSnapshot | null> {
  const queries: string[] = [];
  const seen = new Set<string>();
  const addQuery = (q: string | null | undefined) => {
    const trimmed = q?.trim();
    if (!trimmed || seen.has(trimmed.toLowerCase())) return;
    seen.add(trimmed.toLowerCase());
    queries.push(trimmed);
  };

  addQuery(resolveGeoQuery(location, payload));

  const parsed = location ? parseCityStateFromLocation(location) : null;
  const state = String(
    payload.state ?? payload.siteState ?? payload.stateCode ?? parsed?.state ?? ""
  )
    .trim()
    .toUpperCase();
  if (parsed?.city && state) addQuery(`${parsed.city}, ${state}`);
  if (state && US_STATE_NAMES[state]) addQuery(US_STATE_NAMES[state]);
  if (state) addQuery(state);
  if (parsed?.city && !state) addQuery(parsed.city);

  for (const query of queries) {
    const coords = await geocodeQuery(query);
    if (coords) return fetchForecast(coords.lat, coords.lon);
  }
  return null;
}
