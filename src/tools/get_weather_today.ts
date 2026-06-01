import { lookupCity, getAllCities } from "../data/city_codes";

export const getWeatherTodayDefinition = {
  name: "get_weather_today",
  description:
    "Get today's and tomorrow's weather forecast for a Japanese city. " +
    "Returns weather description, max/min temperature, and precipitation probability. " +
    "Accepts both Japanese city names (e.g. '東京', '大阪') and English names (e.g. 'Tokyo', 'Osaka').",
  inputSchema: {
    type: "object" as const,
    properties: {
      city: {
        type: "string",
        description: "City name in Japanese or English (e.g. '東京', 'Tokyo', '大阪', 'Osaka')",
      },
    },
    required: ["city"],
  },
};

// ---- JMA API types ----

interface JMAArea {
  area: { name: string; code: string };
  weatherCodes?: string[];
  weathers?: string[];
  winds?: string[];
  waves?: string[];
  pops?: string[];
  temps?: string[];
  tempsMin?: string[];
  tempsMax?: string[];
}

interface JMATimeSeries {
  timeDefines: string[];
  areas: JMAArea[];
}

interface JMAForecast {
  publishingOffice: string;
  reportDatetime: string;
  timeSeries: JMATimeSeries[];
}

// ---- helpers ----

function toDateStr(isoString: string): string {
  // "2024-01-01T00:00:00+09:00" → "2024-01-01"
  return isoString.substring(0, 10);
}

function safeInt(v: string | undefined): number | null {
  if (!v || v === "--") return null;
  const n = parseInt(v, 10);
  return isNaN(n) ? null : n;
}

/**
 * 指定日の最高・最低気温を timeSeries[2] から取得する。
 * timeDefines の時刻が 00:00 → 最低気温、09:00 → 最高気温 として扱う。
 */
function extractShortTermTemps(
  ts: JMATimeSeries,
  targetDate: string
): { min: number | null; max: number | null } {
  const area = ts.areas?.[0];
  if (!area) return { min: null, max: null };

  const temps = area.temps ?? [];
  const defines = ts.timeDefines ?? [];

  let min: number | null = null;
  let max: number | null = null;

  for (let i = 0; i < defines.length; i++) {
    if (toDateStr(defines[i]) !== targetDate) continue;
    const hour = parseInt(defines[i].substring(11, 13), 10);
    const val = safeInt(temps[i]);
    if (hour === 0) min = val;
    else if (hour === 9) max = val;
  }
  return { min, max };
}

/**
 * 指定日の降水確率（その日の最大値）を timeSeries[1] から取得する。
 */
function extractDailyPop(ts: JMATimeSeries, targetDate: string): number | null {
  const area = ts.areas?.[0];
  if (!area) return null;

  const pops = area.pops ?? [];
  const defines = ts.timeDefines ?? [];

  const dayPops: number[] = [];
  for (let i = 0; i < defines.length; i++) {
    if (toDateStr(defines[i]) !== targetDate) continue;
    const val = safeInt(pops[i]);
    if (val !== null) dayPops.push(val);
  }
  return dayPops.length > 0 ? Math.max(...dayPops) : null;
}

// ---- main handler ----

export async function handleGetWeatherToday(args: { city: string }): Promise<string> {
  const cityInfo = lookupCity(args.city);

  if (!cityInfo) {
    const supported = getAllCities().map((c) => `${c.nameJa}(${c.nameEn})`).join(", ");
    return JSON.stringify({
      error: "CITY_NOT_FOUND",
      message: `「${args.city}」は対応していない都市名です。get_weather_cities ツールで対応都市の一覧を確認してください。`,
      supported_cities: supported,
    }, null, 2);
  }

  const url = `https://www.jma.go.jp/bosai/forecast/data/forecast/${cityInfo.code}.json`;

  let data: JMAForecast[];
  try {
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}: ${res.statusText}`);
    }
    data = await res.json() as JMAForecast[];
  } catch (err) {
    return JSON.stringify({
      error: "JMA_FETCH_FAILED",
      message: `気象庁APIへの接続に失敗しました。しばらく時間をおいてから再度お試しください。(${String(err)})`,
      city: cityInfo.nameJa,
      region_code: cityInfo.code,
    }, null, 2);
  }

  try {
    const shortTerm = data[0];
    const weatherSeries = shortTerm.timeSeries[0];
    const popSeries = shortTerm.timeSeries[1];
    const tempSeries = shortTerm.timeSeries[2];

    const weatherArea = weatherSeries.areas[0];
    const todayDate = toDateStr(weatherSeries.timeDefines[0]);
    const tomorrowDate = toDateStr(weatherSeries.timeDefines[1] ?? "");

    const todayWeather = weatherArea.weathers?.[0] ?? null;
    const tomorrowWeather = weatherArea.weathers?.[1] ?? null;

    const todayTemps = extractShortTermTemps(tempSeries, todayDate);
    const tomorrowTemps = extractShortTermTemps(tempSeries, tomorrowDate);

    const todayPop = extractDailyPop(popSeries, todayDate);
    const tomorrowPop = extractDailyPop(popSeries, tomorrowDate);

    return JSON.stringify({
      city: cityInfo.nameJa,
      city_en: cityInfo.nameEn,
      prefecture: cityInfo.prefecture,
      region_code: cityInfo.code,
      report_datetime: shortTerm.reportDatetime,
      today: {
        date: todayDate,
        weather: todayWeather,
        temp_max: todayTemps.max,
        temp_min: todayTemps.min,
        rain_probability: todayPop,
      },
      tomorrow: {
        date: tomorrowDate,
        weather: tomorrowWeather,
        temp_max: tomorrowTemps.max,
        temp_min: tomorrowTemps.min,
        rain_probability: tomorrowPop,
      },
    }, null, 2);

  } catch (err) {
    return JSON.stringify({
      error: "PARSE_FAILED",
      message: `気象庁APIのレスポンス解析に失敗しました。気象庁のデータ形式が変更された可能性があります。(${String(err)})`,
      city: cityInfo.nameJa,
      region_code: cityInfo.code,
    }, null, 2);
  }
}
