import type { IDataObject, IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';

export interface MockRequestCall {
	method: string;
	url: string;
	body?: IDataObject;
	qs?: IDataObject;
	headers?: IDataObject;
}

export interface MockExecuteOptions {
	nodeParameters?: Record<string, unknown>;
	credentials?: Record<string, unknown>;
	httpResponse?: unknown;
}

export function createMockExecuteFunctions(options: MockExecuteOptions = {}): {
	ctx: IExecuteFunctions;
	requestCalls: MockRequestCall[];
} {
	const {
		nodeParameters = {},
		credentials = {
			apiKey: 'test-api-key',
			workspaceSlug: 'test-workspace',
			baseUrl: 'https://api.plane.so',
		},
		httpResponse = {},
	} = options;

	const requestCalls: MockRequestCall[] = [];

	const ctx = {
		getNodeParameter(name: string, _index: number, fallback?: unknown) {
			if (name in nodeParameters) {
				return nodeParameters[name];
			}
			if (fallback !== undefined) {
				return fallback;
			}
			throw new Error(`Parameter "${name}" not found`);
		},
		getCredentials: async (_name: string) => credentials,
		getNode: () => ({ name: 'Plane', type: 'n8n-nodes-planeso.plane' }),
		helpers: {
			httpRequest: async (opts: IDataObject) => {
				requestCalls.push({
					method: opts.method as string,
					url: opts.url as string,
					body: opts.body as IDataObject | undefined,
					qs: opts.qs as IDataObject | undefined,
					headers: opts.headers as IDataObject | undefined,
				});
				return httpResponse;
			},
			returnJsonArray(data: IDataObject | IDataObject[]): INodeExecutionData[] {
				const arr = Array.isArray(data) ? data : [data];
				return arr.map((json) => ({ json }));
			},
		},
	} as unknown as IExecuteFunctions;

	return { ctx, requestCalls };
}
