import { LlmAgent } from "@iqai/adk"
import { env } from "../../env"
import { 
  getMostTradedAgentTool,
  getTransactionHistoryTool,
  getTransactionMetricsTool,
  getAdvancedAnalyticsTool,
  predictNextActionsTool
} from "./tools"

export const getIqTransactionAgent = () => {
  const agent = new LlmAgent({
    name: "iq_transaction_agent",
    description: "Advanced transaction analysis agent with access to ATP endpoints for comprehensive trade analysis, pattern recognition, and next-action prediction. Can analyze most traded agents, transaction history, metrics, market sentiment, and predict future trading actions.",
    model: env.LLM_MODEL,
    tools: [
      getMostTradedAgentTool,
      getTransactionHistoryTool,
      getTransactionMetricsTool,
      getAdvancedAnalyticsTool,
      predictNextActionsTool
    ],
  })

  return agent;
}