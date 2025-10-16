import * as fs from "node:fs";
import * as path from "node:path";
import { AgentBuilder, createDatabaseSessionService } from "@iqai/adk";
import { env } from "../env";
import { getIqMarketAgent } from "./iq-market-agent/agent";
import endent from "endent";
import { getIqTransactionAgent } from "./iq-transaction-agent/agent";

/**
 * Creates and configures the root agent for the telegram bot.
 *
 * This agent is responsible for handling every incoming telegram message received by the sampling handler.
 * It delegates tasks to sub-agents, specifically for telling jokes and providing weather information.
 * The root agent uses the "gemini-2.5-flash" model and maintains session state using a SQLite-backed session service.
 *
 * @returns The fully constructed root agent instance, ready to process and route user requests to the appropriate sub-agent.
 */
export const getRootAgent = () => {
	const iqMarketAgent = getIqMarketAgent();
	const iqTransactionAgent = getIqTransactionAgent();

	return AgentBuilder.create("root_agent")
		.withDescription(
			"Root agent that delegates tasks to sub-agents for jokes, weather, and IQ market data.",
		)
		.withInstruction(
			endent`
				Use the joke sub-agent for humor requests.
				Use the weather sub-agent for weather-related queries.
				Use the IQ market sub-agent for agent market data, including:
				- lists
				- top agents
				- info
				- stats
				- holdings
				- prices
				- logs
				
				Use the IQ transaction sub-agent for advanced transaction analysis, including:
				- Most traded agents in the last 7 days
				- Complete transaction history with filtering
				- Transaction metrics and analytics
				- Market sentiment analysis
				- Next-action predictions based on trading patterns
				- Comprehensive trade analysis for investment decisions

				You can also fetch the price of IQ and ETH when prompted using the IQ price endpoint.
			`,
		)
		.withModel(env.LLM_MODEL)
		// .withSessionService(
		// 	createDatabaseSessionService(getSqliteConnectionString("telegram_bot")),
		// )
		.withSubAgents([iqMarketAgent, iqTransactionAgent])
		.build();
};

/**
 * Generates a SQLite connection string and ensures the database directory exists.
 *
 * Creates the data directory if it doesn't exist and returns a properly formatted
 * SQLite connection string for the specified database name.
 *
 * @param dbName - Name of the database file (without .db extension)
 * @returns SQLite connection string in the format "sqlite://path/to/database.db"
 */
function getSqliteConnectionString(dbName: string): string {
	const dbPath = path.join(__dirname, "data", `${dbName}.db`);
	if (!fs.existsSync(path.dirname(dbPath))) {
		fs.mkdirSync(path.dirname(dbPath), { recursive: true });
	}
	return `sqlite://${dbPath}`;
}
