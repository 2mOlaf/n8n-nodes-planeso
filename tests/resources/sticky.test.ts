import { describe, it, expect } from 'bun:test';
import { stickyCreate, stickyGet, stickyGetAll, stickyUpdate, stickyDelete } from '../../nodes/Plane/resources/sticky';
import { createMockExecuteFunctions } from '../helpers/mockExecuteFunctions';

const BASE = '/api/v1/workspaces/test-workspace/stickies';

describe('Sticky', () => {
	describe('create', () => {
		it('should POST with fields', async () => {
			const { ctx, requestCalls } = createMockExecuteFunctions({
				nodeParameters: { additionalFields: { name: 'My Note', background_color: '#fff' } },
				httpResponse: { id: 'st1', name: 'My Note' },
			});

			const result = await stickyCreate.call(ctx);

			expect(requestCalls[0].method).toBe('POST');
			expect(requestCalls[0].url).toBe(`${BASE}/`);
			expect(requestCalls[0].body).toEqual({ name: 'My Note', background_color: '#fff' });
			expect(result[0].json.id).toBe('st1');
		});
	});

	describe('get', () => {
		it('should GET by sticky ID', async () => {
			const { ctx, requestCalls } = createMockExecuteFunctions({
				nodeParameters: { stickyId: 'st1' },
				httpResponse: { id: 'st1' },
			});

			const result = await stickyGet.call(ctx);

			expect(requestCalls[0].method).toBe('GET');
			expect(requestCalls[0].url).toBe(`${BASE}/st1/`);
			expect(result[0].json.id).toBe('st1');
		});
	});

	describe('getAll', () => {
		it('should GET all stickies', async () => {
			const { ctx, requestCalls } = createMockExecuteFunctions({
				nodeParameters: { returnAll: false, limit: 50 },
				httpResponse: [{ id: 'st1' }],
			});

			const result = await stickyGetAll.call(ctx);

			expect(requestCalls[0].method).toBe('GET');
			expect(requestCalls[0].url).toBe(`${BASE}/`);
			expect(result).toHaveLength(1);
		});
	});

	describe('update', () => {
		it('should PATCH with update fields', async () => {
			const { ctx, requestCalls } = createMockExecuteFunctions({
				nodeParameters: { stickyId: 'st1', updateFields: { name: 'Updated Note' } },
				httpResponse: { id: 'st1', name: 'Updated Note' },
			});

			const result = await stickyUpdate.call(ctx);

			expect(requestCalls[0].method).toBe('PATCH');
			expect(requestCalls[0].url).toBe(`${BASE}/st1/`);
			expect(result[0].json.name).toBe('Updated Note');
		});
	});

	describe('delete', () => {
		it('should DELETE by sticky ID', async () => {
			const { ctx, requestCalls } = createMockExecuteFunctions({
				nodeParameters: { stickyId: 'st1' },
				httpResponse: undefined,
			});

			const result = await stickyDelete.call(ctx);

			expect(requestCalls[0].method).toBe('DELETE');
			expect(requestCalls[0].url).toBe(`${BASE}/st1/`);
			expect(result[0].json).toEqual({ success: true });
		});
	});
});
