import type { IDataObject, IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';

function getIntegrationCredentials() {
	const apiKey = process.env.PLANE_API_KEY;
	const workspaceSlug = process.env.PLANE_WORKSPACE_SLUG;
	const baseUrl = (process.env.PLANE_BASE_URL || 'https://api.plane.so').replace(/\/+$/, '');

	if (!apiKey || !workspaceSlug || apiKey.startsWith('op://') || workspaceSlug.startsWith('op://')) {
		return null;
	}

	return { apiKey, workspaceSlug, baseUrl };
}

export function shouldSkipIntegrationTests(): boolean {
	return !getIntegrationCredentials();
}

// Shared rate limit state across all requests (Plane API: 60 req/min)
const rateLimitState = {
	remaining: null as number | null,
	resetAt: null as number | null, // epoch ms
};

export function createIntegrationExecuteFunctions(
	nodeParameters: Record<string, unknown> = {},
): IExecuteFunctions {
	const credentials = getIntegrationCredentials();
	if (!credentials) {
		throw new Error(
			'Integration test credentials not set (PLANE_API_KEY, PLANE_WORKSPACE_SLUG)',
		);
	}

	const ctx = {
		getNodeParameter(name: string, _index: number, fallbackOrOptions?: unknown) {
			if (name in nodeParameters) {
				return nodeParameters[name];
			}
			// { extractValue: true } is an options object, not a fallback
			if (
				fallbackOrOptions !== undefined &&
				(typeof fallbackOrOptions !== 'object' ||
					fallbackOrOptions === null ||
					!('extractValue' in (fallbackOrOptions as Record<string, unknown>)))
			) {
				return fallbackOrOptions;
			}
			throw new Error(`Integration test: parameter "${name}" not provided`);
		},

		getCredentials: async () => credentials,

		getNode: () => ({ name: 'Plane', type: 'n8n-nodes-planeso.plane' }),

		helpers: {
			httpRequest: async (opts: IDataObject) => {
				const baseURL = (opts.baseURL as string) || '';
				const url = (opts.url as string) || '';
				const method = (opts.method as string) || 'GET';
				const headers = (opts.headers as Record<string, string>) || {};
				const body = opts.body ? JSON.stringify(opts.body) : undefined;
				const qs = opts.qs as Record<string, string | number> | undefined;

				const urlObj = new URL(`${baseURL}${url}`);
				if (qs) {
					for (const [key, val] of Object.entries(qs)) {
						urlObj.searchParams.set(key, String(val));
					}
				}

				const doFetch = async () =>
					fetch(urlObj.toString(), {
						method,
						headers,
						body: method !== 'GET' && method !== 'HEAD' ? body : undefined,
					});

				// Proactively wait if we know we're near the rate limit
				const remaining = rateLimitState.remaining;
				if (remaining !== null && remaining <= 2 && rateLimitState.resetAt !== null) {
					const waitMs = rateLimitState.resetAt - Date.now();
					if (waitMs > 0) {
						await new Promise((r) => setTimeout(r, waitMs + 500));
					}
				}

				const maxRetries = 5;
				let response!: Response;

				for (let attempt = 0; attempt <= maxRetries; attempt++) {
					response = await doFetch();

					// Update rate limit state from response headers
					const rlRemaining = response.headers.get('x-ratelimit-remaining');
					const rlReset = response.headers.get('x-ratelimit-reset');
					if (rlRemaining !== null) {
						rateLimitState.remaining = parseInt(rlRemaining, 10);
					}
					if (rlReset !== null) {
						rateLimitState.resetAt = parseInt(rlReset, 10) * 1000; // epoch seconds → ms
					}

					if (response.status !== 429) break;

					if (attempt < maxRetries) {
						// Use X-RateLimit-Reset if available, otherwise fall back to exponential backoff
						let delay: number;
						if (rateLimitState.resetAt !== null) {
							delay = Math.max(rateLimitState.resetAt - Date.now() + 500, 1000);
						} else {
							delay = 3000 * 2 ** attempt;
						}
						await new Promise((r) => setTimeout(r, delay));
					}
				}

				// Match n8n's returnFullResponse shape (used by planeRequest for DELETE)
				if (opts.returnFullResponse) {
					const text = await response.text();
					let parsedBody: unknown = {};
					if (text) {
						try {
							parsedBody = JSON.parse(text);
						} catch {
							parsedBody = text;
						}
					}
					return {
						body: parsedBody,
						statusCode: response.status,
						headers: Object.fromEntries(response.headers.entries()),
					};
				}

				if (!response.ok) {
					const errorBody = await response.text();
					throw new Error(
						`Plane API error ${response.status}: ${response.statusText}\n${errorBody}`,
					);
				}

				const text = await response.text();
				if (!text) return {};
				return JSON.parse(text);
			},

			returnJsonArray(data: IDataObject | IDataObject[]): INodeExecutionData[] {
				const arr = Array.isArray(data) ? data : [data];
				return arr.map((json) => ({ json }));
			},
		},
	} as unknown as IExecuteFunctions;

	return ctx;
}
