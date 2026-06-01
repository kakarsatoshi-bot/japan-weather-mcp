import { McpAgent } from "agents/mcp";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

import { pingToolDefinition, handlePing } from "./tools/ping";
import { getWeatherTodayDefinition, handleGetWeatherToday } from "./tools/get_weather_today";
import { getWeatherWeeklyDefinition, handleGetWeatherWeekly } from "./tools/get_weather_weekly";
import { getWeatherCitiesDefinition, handleGetWeatherCities } from "./tools/get_weather_cities";
import { withLogging } from "./utils/logger";

export interface Env {
  JapanWeatherMcpAgent: DurableObjectNamespace;
}

export class JapanWeatherMcpAgent extends McpAgent<Env> {
  server = new McpServer({
    name: "japan-weather-mcp",
    version: "1.0.0",
  });

  async init() {
    // Tool 1: ping
    this.server.registerTool(
      pingToolDefinition.name,
      {
        description: pingToolDefinition.description,
        inputSchema: {},
        annotations: {
          readOnlyHint: true,
          destructiveHint: false,
          idempotentHint: true,
          openWorldHint: false,
        },
      },
      async () => ({
        content: [{
          type: "text",
          text: await withLogging("ping", {}, () => handlePing()),
        }],
      })
    );

    // Tool 2: get_weather_today
    this.server.registerTool(
      getWeatherTodayDefinition.name,
      {
        description: getWeatherTodayDefinition.description,
        inputSchema: {
          city: z.string().describe("City name in Japanese or English (e.g. '東京', 'Tokyo')"),
        },
        annotations: {
          readOnlyHint: true,
          destructiveHint: false,
          idempotentHint: false,
          openWorldHint: true,
        },
      },
      async ({ city }) => ({
        content: [{
          type: "text",
          text: await withLogging("get_weather_today", { city },
            () => handleGetWeatherToday({ city })
          ),
        }],
      })
    );

    // Tool 3: get_weather_weekly
    this.server.registerTool(
      getWeatherWeeklyDefinition.name,
      {
        description: getWeatherWeeklyDefinition.description,
        inputSchema: {
          city: z.string().describe("City name in Japanese or English (e.g. '東京', 'Tokyo')"),
        },
        annotations: {
          readOnlyHint: true,
          destructiveHint: false,
          idempotentHint: false,
          openWorldHint: true,
        },
      },
      async ({ city }) => ({
        content: [{
          type: "text",
          text: await withLogging("get_weather_weekly", { city },
            () => handleGetWeatherWeekly({ city })
          ),
        }],
      })
    );

    // Tool 4: get_weather_cities
    this.server.registerTool(
      getWeatherCitiesDefinition.name,
      {
        description: getWeatherCitiesDefinition.description,
        inputSchema: {},
        annotations: {
          readOnlyHint: true,
          destructiveHint: false,
          idempotentHint: true,
          openWorldHint: false,
        },
      },
      async () => ({
        content: [{
          type: "text",
          text: await withLogging("get_weather_cities", {}, () => handleGetWeatherCities()),
        }],
      })
    );
  }
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === "/health") {
      return new Response(
        JSON.stringify({
          status: "ok",
          server: "japan-weather-mcp",
          version: "1.0.0",
          data_source: "Japan Meteorological Agency (JMA)",
          timestamp: new Date().toISOString(),
        }),
        { headers: { "Content-Type": "application/json" } }
      );
    }

    if (url.pathname === "/mcp") {
      return JapanWeatherMcpAgent.serve("/mcp").fetch(request, env, ctx);
    }

    return new Response(
      JSON.stringify({
        name: "Japan Weather MCP",
        description: "Weather forecast for Japan powered by JMA data",
        mcp_endpoint: "/mcp",
        health_endpoint: "/health",
        tools: ["ping", "get_weather_today", "get_weather_weekly", "get_weather_cities"],
      }),
      { headers: { "Content-Type": "application/json" } }
    );
  },
} satisfies ExportedHandler<Env>;
