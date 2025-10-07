import { createTool } from "@iqai/adk";
import * as z from "zod";

const baseUrl = "https://app.iqai.com";

function buildQuery(params: Record<string, unknown>): string {
	const search = new URLSearchParams();
	for (const [key, value] of Object.entries(params)) {
		if (value === undefined || value === null || value === "") continue;
		search.set(key, String(value));
	}
	const qs = search.toString();
	return qs ? `?${qs}` : "";
}

function formatJson(value: unknown, pretty?: boolean): string | unknown {
	if (pretty) return JSON.stringify(value, null, 2);
	return value as unknown;
}

async function safeJson(res: Response) {
	const text = await res.text();
	try {
		return JSON.parse(text);
	} catch {
		return text;
	}
}

export const getAgentsTool = createTool({
	name: "get_agents",
	description:
		"List agents with optional sort, order, status, chainId, page, limit",
    schema: z
		.object({
			sort: z.enum(["latest", "marketCap", "holders", "inferences"]).optional(),
			order: z.enum(["asc", "desc"]).optional(),
			status: z.enum(["alive", "latent"]).optional(),
			chainId: z.union([z.string(), z.number()]).optional(),
			page: z.number().int().min(1).optional(),
			limit: z.number().int().min(1).max(100).optional(),
			pretty: z.boolean().optional(),
		}),
	fn: async (args, _ctx) => {
        const qs = buildQuery(args as Record<string, unknown>);
		const res = await fetch(`${baseUrl}/api/agents${qs}`);
		if (!res.ok) return `Failed to fetch agents: ${res.status}`;
		const data = await safeJson(res);
        return formatJson(data, (args as any).pretty);
	},
});

export const getTopAgentsTool = createTool({
	name: "get_top_agents",
	description: "Get top agents by mcap, holders, or inferences",
    schema: z.object({
		sort: z.enum(["mcap", "holders", "inferences"]).optional(),
		limit: z.number().int().min(1).max(100).optional(),
		pretty: z.boolean().optional(),
	}),
    fn: async (args, _ctx) => {
        const { sort, limit, pretty } = args as any;
        const qs = buildQuery({ sort, limit });
		const res = await fetch(`${baseUrl}/api/agents/top${qs}`);
		if (!res.ok) return `Failed to fetch top agents: ${res.status}`;
		const data = await safeJson(res);
        return formatJson(data, pretty);
	},
});

export const getAgentInfoTool = createTool({
	name: "get_agent_info",
	description: "Get agent info by address or ticker (XOR)",
    schema: z
		.object({
			address: z.string().optional(),
			ticker: z.string().optional(),
			pretty: z.boolean().optional(),
		})
		.refine((v) => Boolean(v.address) !== Boolean(v.ticker), {
			message: "Provide either address or ticker, not both",
		}),
    fn: async (args, _ctx) => {
        const { address, ticker, pretty } = args as any;
        const qs = buildQuery({ address, ticker });
		const res = await fetch(`${baseUrl}/api/agents/info${qs}`);
		if (!res.ok) return `Failed to fetch agent info: ${res.status}`;
		const data = await safeJson(res);
        return formatJson(data, pretty);
	},
});

export const getAgentStatsTool = createTool({
	name: "get_agent_stats",
	description:
		"Get agent stats by address or ticker; extendedStats only allowed with address",
    schema: z
		.object({
			address: z.string().optional(),
			ticker: z.string().optional(),
			extendedStats: z.boolean().optional(),
			pretty: z.boolean().optional(),
		})
		.refine((v) => Boolean(v.address) !== Boolean(v.ticker), {
			message: "Provide either address or ticker, not both",
		})
		.refine((v) => !v.extendedStats || Boolean(v.address), {
			message: "extendedStats is only allowed with address",
		}),
    fn: async (args, _ctx) => {
        const { address, ticker, extendedStats, pretty } = args as any;
        const qs = buildQuery({ address, ticker, extendedStats: extendedStats ? "true" : undefined });
		const res = await fetch(`${baseUrl}/api/agents/stats${qs}`);
		if (!res.ok) return `Failed to fetch agent stats: ${res.status}`;
		const data = await safeJson(res);
        return formatJson(data, pretty);
	},
});

export const getHoldingsTool = createTool({
	name: "get_holdings",
	description: "Get holdings for a wallet address (agent tokens only)",
    schema: z.object({
		address: z.string(),
		chainId: z.union([z.string(), z.number()]).optional(),
		pretty: z.boolean().optional(),
	}),
    fn: async (args, _ctx) => {
        const { address, pretty } = args as any;
        const chainId = (args as any).chainId ?? "252";
        const qs = buildQuery({ address, chainId });
		const res = await fetch(`${baseUrl}/api/holdings${qs}`);
		if (!res.ok) return `Failed to fetch holdings: ${res.status}`;
		const data = await safeJson(res);
        return formatJson(data, pretty);
	},
});

export const getLogsTool = createTool({
	name: "get_logs",
	description: "Get logs for an agent by token contract",
    schema: z.object({
		agentTokenContract: z.string(),
		page: z.number().int().min(1).optional(),
		limit: z.number().int().min(1).max(100).optional(),
		pretty: z.boolean().optional(),
	}),
    fn: async (args, _ctx) => {
        const { agentTokenContract, page, limit, pretty } = args as any;
        const qs = buildQuery({ agentTokenContract, page, limit });
		const res = await fetch(`${baseUrl}/api/logs${qs}`);
		if (!res.ok) return `Failed to fetch logs: ${res.status}`;
		const data = await safeJson(res);
        return formatJson(data, pretty);
	},
});

export const getPricesTool = createTool({
	name: "get_prices",
	description: "Get USD prices via IQ Gateway (eth|frax|all)",
    schema: z.object({
		type: z.enum(["eth", "frax", "all"]).optional(),
		pretty: z.boolean().optional(),
	}),
    fn: async (args, _ctx) => {
        const { type, pretty } = args as any;
        const qs = buildQuery({ type });
		const res = await fetch(`${baseUrl}/api/prices${qs}`);
		if (!res.ok) return `Failed to fetch prices: ${res.status}`;
		const data = await safeJson(res);
        return formatJson(data, pretty);
	},
});



