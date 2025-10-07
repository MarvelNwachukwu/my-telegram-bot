import { LlmAgent } from "@iqai/adk";
import { env } from "../../env";
import {
	getAgentInfoTool,
	getAgentStatsTool,
	getAgentsTool,
	getHoldingsTool,
	getLogsTool,
	getPricesTool,
	getTopAgentsTool,
} from "./tools";

export const getIqMarketAgent = () => {
	const agent = new LlmAgent({
		name: "iq_market_agent",
		description:
			"Fetches market and metadata from IQ AI: agents list, top, info, stats, holdings, prices, and logs.",
		model: env.LLM_MODEL,
		tools: [
			getAgentsTool,
			getTopAgentsTool,
			getAgentInfoTool,
			getAgentStatsTool,
			getHoldingsTool,
			getLogsTool,
			getPricesTool,
		],
	});
	return agent;
};



