# Japan Weather MCP

An MCP (Model Context Protocol) server that lets AI assistants like Claude query Japan's official weather forecast data.

**Ask questions like:**
- "What is today's weather in Tokyo?"
- "Show me the weekly forecast for Osaka"
- "What cities are supported for weather lookup?"

Powered by the **Japan Meteorological Agency (JMA)** official forecast data.

## Tools

| Tool | Description |
|------|-------------|
| `ping` | Connection test — returns server version info |
| `get_weather_today` | Get today's weather forecast for a specified Japanese city |
| `get_weather_weekly` | Get the weekly weather forecast for a specified Japanese city |
| `get_weather_cities` | List all supported cities for weather lookup |

## Usage (Claude Desktop)

Add to your `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "japan-weather": {
      "type": "http",
      "url": "https://japan-weather-mcp.tsukuras-jp.workers.dev/mcp"
    }
  }
}
```

## Data Source

- **Provider**: Japan Meteorological Agency (気象庁)
- **URL**: https://www.jma.go.jp
- **License**: Public domain (government open data)
- **Update frequency**: Daily

## Development

```bash
# Install dependencies
npm install

# Local development
npm run dev

# Deploy to Cloudflare Workers
npm run deploy
```

## Tech Stack

- TypeScript + Cloudflare Workers
- MCP SDK (`agents` + `@modelcontextprotocol/sdk`)

## Author

[Tsukuras](https://tsukuras.jp)

## License

MIT


## 🔗 Related MCPs (Japan Data Series)

| MCP | Description |
|---|---|
| [japan-holiday-mcp](https://github.com/kakarsatoshi-bot/japan-holiday-mcp) | Japanese national holidays |
| [japan-weather-mcp](https://github.com/kakarsatoshi-bot/japan-weather-mcp) | Japan weather forecast (JMA) |
| [japan-realestate-mcp](https://github.com/kakarsatoshi-bot/japan-realestate-mcp) | Japan real estate transaction prices (MLIT) |