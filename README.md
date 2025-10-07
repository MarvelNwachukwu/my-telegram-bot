
<div align="center">

<img src="https://files.catbox.moe/vumztw.png" alt="ADK TypeScript Logo" width="100" />

_Persistent Memory • Telegram Integration • TypeScript_

---

</div>


A Telegram bot starter template powered by ADK (AI Development Kit) that enables you to create intelligent, conversational bots for Telegram. This template provides a solid foundation for building AI-powered Telegram bots with persistent conversation memory.

---




## Prerequisites


> [!note]
> **You'll need the following before you begin.** For details on how to obtain these, see [Configure Your Bot](#3-configure-your-bot).

- **Telegram Bot Token**: Create a bot via [@BotFather](https://t.me/botfather) on Telegram
- **AI API Key**: Get an API key for your chosen AI model (e.g., Google AI Studio for Gemini)

## Quick Start


The easiest way to create a new Telegram bot project using this template is with the ADK CLI:

```bash
npm install -g @iqai/adk-cli # if you haven't already
adk new --template telegram-bot my-telegram-bot
cd my-telegram-bot
pnpm install
```

You can also use this template directly by copying the files, but using the CLI is recommended for best results.

### Running the Bot

**Default (Production/Development) Route**

To run your Telegram bot in production or for standard development, use:
```bash
pnpm dev
```

**Fast Iteration & Agent Setup (ADK CLI)**

For rapid prototyping, interactive testing, or initial agent setup, use the ADK CLI:
```bash
adk run   # Interactive CLI chat with your agents
adk web   # Web interface for easy testing and demonstration
```

2. **Environment setup**
   ```bash
   cp example.env .env
   # Edit .env with your tokens and API keys
   ```


3. **Configure Your Bot**

To set up your Telegram bot:

1. Start a chat with [@BotFather](https://t.me/botfather) on Telegram.
2. Send `/newbot` and follow the instructions to create a new bot.
3. Choose a name and a username for your bot (the username must end in 'bot').
4. Copy the token provided by BotFather.
5. Add the token to your `.env` file as `TELEGRAM_BOT_TOKEN`.
6. (Optional) Adjust other environment variables as needed.

4. **Development**
   
   **Option 1: Traditional Development**
   ```bash
   pnpm dev
   ```
   
   **Option 2: ADK CLI (Recommended for Testing)**
   
   First, install the ADK CLI globally:
   ```bash
   npm install -g @iqai/adk-cli
   ```
   
   Then use either:
   ```bash
   # Interactive CLI chat with your agents
   adk run
   
   # Web interface for easy testing
   adk web
   ```

5. **Production**
   ```bash
   pnpm build
   pnpm start
   ```


## Environment Variables

Required variables in your `.env` file:

```env
# Telegram Bot Configuration
TELEGRAM_BOT_TOKEN=your_telegram_bot_token_here

# AI Model Configuration
LLM_MODEL=gemini-2.5-flash
GOOGLE_API_KEY=your_google_api_key_here

# Optional
ADK_DEBUG=false
IQ_API_KEY=your_iq_api_key_if_using_logs
IQ_API_BASE_URL=https://app.iqai.com
```

## IQ Market Data Agent

The bot includes an `iq_market_agent` that can fetch market and metadata from IQ AI.

Capabilities (see IQ AI API Docs: https://app.iqai.com/docs):

- List agents with filters
- Top agents by market cap/holders/inferences
- Agent info by address or ticker
- Agent stats (extended stats with address)
- Holdings for a wallet
- Prices (ETH/FRAX/ALL)
- Logs (get) 

Examples you can ask the bot:

- "Show top 5 agents by holders"
- "Get stats for address 0x... with extended stats"
- "What is the price of ETH?"
- "List my holdings for address 0x... on chain 252"

## About MCP & Sampling

This template uses the Model Context Protocol (MCP) to connect your agent to Telegram. The MCP server listens for new messages and events, and uses "sampling" to request LLM completions from your agent. This enables your bot to respond to messages and perform actions in Telegram, supporting true agentic, bi-directional communication.

For more details, see the [MCP Telegram documentation](https://adk.iqai.com/docs/mcp-servers/telegram).




## Database

- **Location**: `src/data/telegram_bot.db`
- **Purpose**: Stores conversation history and context
- **Auto-created**: Database and tables are created automatically



## File Structure

```
src/
├── agents/           # Agent definitions (compatible with ADK CLI)
│   ├── agent.ts      # Root agent configuration
│   ├── telegram-agent/ # Telegram-specific agent and tools
│   ├── joke-agent/   # Joke-telling agent
│   └── weather-agent/ # Weather information agent
├── index.ts          # Main bot initialization and configuration
├── env.ts            # Environment variable validation
└── data/             # SQLite database storage (auto-created)
   └── telegram_bot.db
```


## Deployment

### Local Development
```bash
pnpm dev
```

### Production Server
```bash
pnpm build
pnpm start
```

### Docker
```bash
docker build -t telegram-bot .
docker run --env-file .env telegram-bot
```


## Testing Your Bot

You can test your bot by sending messages to it on Telegram, or by using the ADK CLI for local/interactive testing.


## Learn More

- [ADK Documentation](https://adk.iqai.com)
- [MCP Telegram Server Docs](https://adk.iqai.com/docs/mcp-servers/telegram)
- [Telegram Bot API](https://core.telegram.org/bots/api)
- [BotFather Guide](https://core.telegram.org/bots#6-botfather)
