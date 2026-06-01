import { getAllCities } from "../data/city_codes";

export const getWeatherCitiesDefinition = {
  name: "get_weather_cities",
  description:
    "Returns the list of cities supported by japan-weather-mcp. " +
    "Use this when a user asks which cities are available, or to guide users when an unsupported city is requested.",
  inputSchema: {
    type: "object" as const,
    properties: {},
    required: [],
  },
};

export async function handleGetWeatherCities(): Promise<string> {
  const cities = getAllCities().map((c) => ({
    nameJa: c.nameJa,
    nameEn: c.nameEn,
    prefecture: c.prefecture,
  }));

  return JSON.stringify({
    total: cities.length,
    note: "Both Japanese (e.g. '東京') and English (e.g. 'Tokyo') city names are accepted.",
    cities,
  }, null, 2);
}
