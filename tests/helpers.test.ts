import { describe, it, expect } from 'bun:test';
import { getWorkspaceSlug, planeRequest, planeRequestCursorAllItems, planeRequestOffsetAllItems } from '../nodes/Plane/utils/helpers';
import type { IDataObject, IExecuteFunctions } from 'n8n-workflow';

function createCtx(httpResponses: unknown[]) {
	let callIndex = 0;
	const requestCalls: IDataObject[] = [];

	const ctx = {
		getCredentials: async () => ({
			apiKey: 'test-key',
			workspaceSlug: 'my-ws',
			baseUrl: 'https://api.plane.so/',
		}),
		helpers: {
			httpRequest: async (opts: IDataObject) => {
				requestCalls.push(opts);
				return httpResponses[callIndex++];
			},
		},
	} as unknown as IExecuteFunctions;

	return { ctx, requestCalls };
}

describe('Helpers', () => {
	describe('getWorkspaceSlug', () => {
		it('should return workspace slug from credentials', async () => {
			const { ctx } = createCtx([]);
			const slug = await getWorkspaceSlug(ctx);
			expect(slug).toBe('my-ws');
		});
	});

	describe('planeRequest', () => {
		it('should set correct headers and base URL', async () => {
			const { ctx, requestCalls } = createCtx([{ id: '1' }]);

			await planeRequest.call(ctx, { method: 'GET', url: '/api/v1/test/' });

			expect(requestCalls).toHaveLength(1);
			expect(requestCalls[0].baseURL).toBe('https://api.plane.so');
			expect((requestCalls[0].headers as IDataObject)['X-API-Key']).toBe('test-key');
			expect((requestCalls[0].headers as IDataObject)['Content-Type']).toBe('application/json');
		});

		it('should strip trailing slashes from base URL', async () => {
			const { ctx, requestCalls } = createCtx([{}]);

			await planeRequest.call(ctx, { method: 'GET', url: '/test/' });

			expect(requestCalls[0].baseURL).toBe('https://api.plane.so');
		});
	});

	describe('planeRequestCursorAllItems', () => {
		it('should return all items when returnAll is true', async () => {
			const { ctx } = createCtx([
				{ results: [{ id: '1' }, { id: '2' }], next_cursor: 'abc', next_page_results: true },
				{ results: [{ id: '3' }], next_cursor: undefined, next_page_results: false },
			]);

			const results = await planeRequestCursorAllItems.call(
				ctx,
				{ method: 'GET', url: '/test/' },
				true,
				100,
			);

			expect(results).toHaveLength(3);
		});

		it('should respect limit when returnAll is false', async () => {
			const { ctx } = createCtx([
				{ results: [{ id: '1' }, { id: '2' }, { id: '3' }], next_cursor: undefined, next_page_results: false },
			]);

			const results = await planeRequestCursorAllItems.call(
				ctx,
				{ method: 'GET', url: '/test/' },
				false,
				2,
			);

			expect(results).toHaveLength(2);
		});

		it('should stop when no more pages', async () => {
			const { ctx, requestCalls } = createCtx([
				{ results: [{ id: '1' }], next_cursor: undefined, next_page_results: false },
			]);

			await planeRequestCursorAllItems.call(ctx, { method: 'GET', url: '/test/' }, true, 100);

			expect(requestCalls).toHaveLength(1);
		});
	});

	describe('planeRequestOffsetAllItems', () => {
		it('should return all items when returnAll is true', async () => {
			const { ctx } = createCtx([
				Array.from({ length: 100 }, (_, i) => ({ id: `a${i}` })),
				[{ id: 'b1' }, { id: 'b2' }],
			]);

			const results = await planeRequestOffsetAllItems.call(
				ctx,
				{ method: 'GET', url: '/test/' },
				true,
				100,
			);

			expect(results).toHaveLength(102);
		});

		it('should respect limit when returnAll is false', async () => {
			const { ctx } = createCtx([
				[{ id: '1' }, { id: '2' }, { id: '3' }],
			]);

			const results = await planeRequestOffsetAllItems.call(
				ctx,
				{ method: 'GET', url: '/test/' },
				false,
				2,
			);

			expect(results).toHaveLength(2);
		});

		it('should handle response with results property', async () => {
			const { ctx } = createCtx([
				{ results: [{ id: '1' }] },
			]);

			const results = await planeRequestOffsetAllItems.call(
				ctx,
				{ method: 'GET', url: '/test/' },
				false,
				50,
			);

			expect(results).toHaveLength(1);
			expect((results[0] as IDataObject).id).toBe('1');
		});
	});
});
