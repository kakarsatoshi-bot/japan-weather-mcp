export const pingToolDefinition = {
  name: "ping",
  description: "Connection test tool for japan-weather-mcp. Returns pong with version info.",
  inputSchema: {
    type: "object" as const,
    properties: {},
    required: [],
  },
};

export async function handlePing(): Promise<string> {
  return JSON.stringify({
    status: "pong",
    server: "japan-weather-mcp",
    version: "1.0.0",
    data_source: "Japan Meteorological Agency (JMA)",
    timestamp: new Date().toISOString(),
  }, null, 2);
}
