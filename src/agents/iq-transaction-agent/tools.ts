import { createTool } from "@iqai/adk"
import { z } from "zod"

// Base URL for IQ AI API
const IQ_AI_BASE_URL = "https://app.iqai.com"

// Helper function for API calls
async function makeApiCall(endpoint: string, options: RequestInit = {}) {
  try {
    const response = await fetch(`${IQ_AI_BASE_URL}${endpoint}`, {
      headers: {
        "Content-Type": "application/json",
        ...options.headers
      },
      ...options
    });

    if (!response.ok) {
      return `Failed to fetch data: ${response.status} ${response.statusText}`;
    }

    const data = await response.json();
    return JSON.stringify(data, null, 2);
  } catch (error) {
    return `Error: ${error instanceof Error ? error.message : 'Unknown error'}`;
  }
}

// Tool 8: Transaction History (GET /api/transactions)
export const getTransactionHistoryTool = createTool({
  name: "get_transaction_history", 
  description: "Get paginated trade history with optional filters for agent ticker, user, or token contract",
  schema: z.object({
    page: z.number().optional().describe("Page number (default: 1)"),
    ticker: z.string().optional().describe("Filter by agent ticker (e.g., 'SOPHIA', 'FLASH')"),
    agentTokenContract: z.string().optional().describe("Filter by agent token contract address"),
    userId: z.string().optional().describe("Filter by user ID")
  }),
  fn: async (args) => {
    const params = new URLSearchParams();
    Object.entries(args as any).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, String(value));
      }
    });
    
    const queryString = params.toString();
    return await makeApiCall(`/api/transactions${queryString ? `?${queryString}` : ''}`);
  }
});

// Tool 9: Transaction Metrics (GET /api/metrics)
export const getTransactionMetricsTool = createTool({
  name: "get_transaction_metrics",
  description: "Get aggregate trade metrics or most traded agent over past 7 days",
  schema: z.object({
    view: z.enum(["overall", "mostTraded7d"]).optional().describe("View type: overall metrics or most traded agent in last 7 days (default: overall)")
  }),
  fn: async (args) => {
    const { view = "overall" } = args as any;
    return await makeApiCall(`/api/metrics?view=${view}`);
  }
});

// Tool 1: Most Traded Agent (using metrics endpoint)
export const getMostTradedAgentTool = createTool({
  name: "get_most_traded_agent",
  description: "Get the most traded agent in the last 7 days with trade count and agent details",
  schema: z.object({}),
  fn: async () => {
    return await makeApiCall(`/api/metrics?view=mostTraded7d`);
  }
});

// Advanced analytics tool combining multiple endpoints
export const getAdvancedAnalyticsTool = createTool({
  name: "get_advanced_analytics",
  description: "Get comprehensive analytics by combining transaction history and metrics for deep analysis",
  schema: z.object({
    ticker: z.string().optional().describe("Specific agent ticker to analyze (e.g., 'SOPHIA', 'FLASH')"),
    userId: z.string().optional().describe("Specific user to analyze"),
    pages: z.number().optional().describe("Number of pages to fetch for history (default: 1)"),
    includeOverallMetrics: z.boolean().optional().describe("Include overall platform metrics (default: true)")
  }),
  fn: async (args) => {
    const { ticker, userId, pages = 1, includeOverallMetrics = true } = args as any;
    
    let results: any = {};
    
    // Get transaction history
    const historyParams = new URLSearchParams();
    if (ticker) {
      historyParams.append('ticker', ticker);
    }
    if (userId) {
      historyParams.append('userId', userId);
    }
    historyParams.append('page', '1');
    
    const historyResult = await makeApiCall(`/api/transactions?${historyParams.toString()}`);
    results.transactionHistory = historyResult;
    
    // Get overall metrics if requested
    if (includeOverallMetrics) {
      const metricsResult = await makeApiCall('/api/metrics?view=overall');
      results.overallMetrics = metricsResult;
    }
    
    // Get most traded agent
    const mostTradedResult = await makeApiCall('/api/metrics?view=mostTraded7d');
    results.mostTradedAgent = mostTradedResult;
    
    return JSON.stringify(results, null, 2);
  }
});

// Prediction tool based on historical patterns
export const predictNextActionsTool = createTool({
  name: "predict_next_actions",
  description: "Analyze transaction patterns and predict likely next actions based on historical data",
  schema: z.object({
    ticker: z.string().optional().describe("Specific agent ticker to analyze (e.g., 'SOPHIA', 'FLASH')"),
    userId: z.string().optional().describe("Specific user to analyze"),
    analysisDepth: z.number().optional().describe("Number of pages to analyze (default: 3)")
  }),
  fn: async (args) => {
    const { ticker, userId, analysisDepth = 3 } = args as any;
    
    // Get recent transaction history for analysis
    const historyParams = new URLSearchParams();
    if (ticker) {
      historyParams.append('ticker', ticker);
    }
    if (userId) {
      historyParams.append('userId', userId);
    }
    
    let allTransactions: any[] = [];
    
    // Fetch multiple pages for pattern analysis
    for (let page = 1; page <= analysisDepth; page++) {
      const pageParams = new URLSearchParams(historyParams);
      pageParams.append('page', page.toString());
      
      const result = await makeApiCall(`/api/transactions?${pageParams.toString()}`);
      try {
        const data = JSON.parse(result);
        if (data.transactions) {
          allTransactions.push(...data.transactions);
        }
      } catch (e) {
        // Continue if parsing fails
      }
    }
    
    // Analyze patterns
    const buyTransactions = allTransactions.filter(t => t.isBuy);
    const sellTransactions = allTransactions.filter(t => !t.isBuy);
    const totalUsdAmount = allTransactions.reduce((sum, t) => sum + parseFloat(t.usdAmount || 0), 0);
    
    const analysis = {
      totalTransactions: allTransactions.length,
      buyRatio: buyTransactions.length / allTransactions.length,
      sellRatio: sellTransactions.length / allTransactions.length,
      averageUsdAmount: totalUsdAmount / allTransactions.length,
      recentActivity: allTransactions.slice(0, 10),
      patterns: {
        mostActiveAgent: ticker || 'N/A',
        tradingFrequency: allTransactions.length / analysisDepth,
        averageTradeSize: totalUsdAmount / allTransactions.length,
        buyVsSellRatio: buyTransactions.length / sellTransactions.length,
        totalVolume: totalUsdAmount
      }
    };
    
    return JSON.stringify(analysis, null, 2);
  }
});