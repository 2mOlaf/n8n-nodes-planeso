import type {
	IDataObject,
	IExecuteFunctions,
	IHttpRequestOptions,
} from 'n8n-workflow';

export async function getWorkspaceSlug(ctx: IExecuteFunctions): Promise<string> {
	const credentials = await ctx.getCredentials('planeApi');
	return credentials.workspaceSlug as string;
}

export async function planeRequest(
	this: IExecuteFunctions,
	options: Partial<IHttpRequestOptions> = {},
) {
	const credentials = await this.getCredentials('planeApi');
	const apiKey = credentials.apiKey as string;
	const baseUrl = (credentials.baseUrl as string).replace(/\/+$/, '');

	const headers = {
		Accept: 'application/json',
		'Content-Type': 'application/json',
		...(options.headers ?? {}),
		'X-API-Key': apiKey,
	};

	const opts: IHttpRequestOptions = {
		baseURL: baseUrl,
		...options,
		headers,
	} as IHttpRequestOptions;

	return this.helpers.httpRequest!(opts);
}

export async function planeRequestCursorAllItems(
	this: IExecuteFunctions,
	options: Partial<IHttpRequestOptions>,
	returnAll: boolean,
	limit: number,
) {
	const allResults: IDataObject[] = [];
	let cursor: string | undefined;

	const perPage = returnAll ? 100 : Math.min(limit, 100);

	do {
		const qs = { ...(options.qs as IDataObject ?? {}), per_page: perPage } as IDataObject;
		if (cursor) {
			qs.cursor = cursor;
		}

		const response = (await planeRequest.call(this, {
			...options,
			qs,
		})) as IDataObject;

		const results = (response.results as IDataObject[]) ?? [];
		allResults.push(...results);

		if (!returnAll && allResults.length >= limit) {
			return allResults.slice(0, limit);
		}

		cursor = response.next_cursor as string | undefined;
		const hasMore = response.next_page_results as boolean;
		if (!hasMore) break;
	} while (cursor);

	return allResults;
}

export async function planeRequestOffsetAllItems(
	this: IExecuteFunctions,
	options: Partial<IHttpRequestOptions>,
	returnAll: boolean,
	limit: number,
) {
	const allResults: IDataObject[] = [];
	let offset = 0;

	const pageSize = returnAll ? 100 : Math.min(limit, 100);

	for (;;) {
		const qs = { ...(options.qs as IDataObject ?? {}), limit: pageSize, offset } as IDataObject;

		const response = await planeRequest.call(this, {
			...options,
			qs,
		});

		let results: IDataObject[];
		if (Array.isArray(response)) {
			results = response as IDataObject[];
		} else {
			results = ((response as IDataObject).results as IDataObject[]) ?? [];
		}

		allResults.push(...results);

		if (!returnAll && allResults.length >= limit) {
			return allResults.slice(0, limit);
		}

		if (results.length < pageSize) break;
		offset += results.length;
	}

	return allResults;
}
