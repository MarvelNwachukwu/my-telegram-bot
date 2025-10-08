import { LlmAgent } from "@iqai/adk"
import { env } from "../../env"
import { getIqTransactionTool } from "./tools"

export const getIqTransactionAgent = () => {
  const agent = new LlmAgent({
    name: "iq_transaction_agent",
    description: "Has access to all transactions on IQ Agent trading platform and can analyze patterns to predict agents to buy or sell",
    model: env.LLM_MODEL,
    tools: [
      getIqTransactionTool,
    ],
  })

  return agent;
}