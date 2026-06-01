import { lookupCity, getAllCities } from "../data/city_codes";

export const getWeatherWeeklyDefinition = {
  name: "get_weather_weekly",
  description:
    "Get the 7-day weekly weather forecast for a Japanese city. " +
    "Returns weather description, max/min temperature, and precipitation probability for each day. " +
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
  pops?: string[];
  reliabilities?: string[];
  tempsMin?: string[];
  tempsMax?: string[];
  tempsMinUpper?: string[];
  tempsMinLower?: string[];
  tempsMaxUpper?: string[];
  tempsMaxLower?: string[];
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
  return isoString.substring(0, 10);
}

function safeInt(v: string | undefined): number | null {
  if (!v || v === "--") return null;
  const n = parseInt(v, 10);
  return isNaN(n) ? null : n;
}

// ---- main handler ----

export async function handleGetWeatherWeekly(args: { city: string }): Promise<string> {
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
    const weekly = data[1];
    const weatherSeries = weekly.timeSeries[0];
    const tempSeries = weekly.timeSeries[1];

    const weatherArea = weatherSeries.areas[0];
    const tempArea = tempSeries?.areas[0];

    const dates = weatherSeries.timeDefines.map(toDateStr);
    const weathers = weatherArea.weathers ?? [];
    const pops = weatherArea.pops ?? [];

    const tempsMin = tempArea?.tempsMin ?? [];
    const tempsMax = tempArea?.tempsMax ?? [];

    // 週間予報の日付と気温データは date 数が一致しない場合がある（今日分が短期側に含まれるため）
    // tempSeries.timeDefines を基準に気温インデックスを解決する
    const tempDates = (tempSeries?.timeDefines ?? []).map(toDateStr);
    const tempIndexByDate: Record<string, number> = {};
    tempDates.forEach((d, i) => {
      tempIndexByDate[d] = i;
    });

    const forecast = dates.map((date, i) => {
      const tempIdx = tempIndexByDate[date] ?? -1;
      return {
        date,
        weather: weathers[i] ?? null,
        temp_max: tempIdx >= 0 ? safeInt(tempsMax[tempIdx]) : null,
        temp_min: tempIdx >= 0 ? safeInt(tempsMin[tempIdx]) : null,
        rain_probability: safeInt(pops[i]),
      };
    });

    return JSON.stringify({
      city: cityInfo.nameJa,
      city_en: cityInfo.nameEn,
      prefecture: cityInfo.prefecture,
      region_code: cityInfo.code,
      report_datetime: weekly.reportDatetime,
      forecast,
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
