import { describe, it, expect } from 'bun:test';
import { initiativeCreate, initiativeGet, initiativeGetAll, initiativeUpdate, initiativeDelete } from '../../nodes/Plane/resources/initiative';
import { createMockExecuteFunctions } from '../helpers/mockExecuteFunctions';

const BASE = '/api/v1/workspaces/test-workspace/initiatives';

describe('Initiative', () => {
	describe('create', () => {
		it('should POST with required fields', async () => {
			const { ctx, requestCalls } = createMockExecuteFunctions({
				nodeParameters: { name: 'Q1 Goals', additionalFields: {} },
				httpResponse: { id: 'init1', name: 'Q1 Goals' },
			});

			const result = await initiativeCreate.call(ctx);

			expect(requestCalls[0].method).toBe('POST');
			expect(requestCalls[0].url).toBe(`${BASE}/`);
			expect(requestCalls[0].body).toEqual({ name: 'Q1 Goals' });
			expect(result[0].json.id).toBe('init1');
		});
	});

	describe('get', () => {
		it('should GET by initiative ID', async () => {
			const { ctx, requestCalls } = createMockExecuteFunctions({
				nodeParameters: { initiativeId: 'init1' },
				httpResponse: { id: 'init1' },
			});

			const result = await initiativeGet.call(ctx);

			expect(requestCalls[0].method).toBe('GET');
			expect(requestCalls[0].url).toBe(`${BASE}/init1/`);
			expect(result[0].json.id).toBe('init1');
		});
	});

	describe('getAll', () => {
		it('should GET all initiatives', async () => {
			const { ctx, requestCalls } = createMockExecuteFunctions({
				nodeParameters: { returnAll: false, limit: 50 },
				httpResponse: [{ id: 'init1' }],
			});

			const result = await initiativeGetAll.call(ctx);

			expect(requestCalls[0].method).toBe('GET');
			expect(requestCalls[0].url).toBe(`${BASE}/`);
			expect(result).toHaveLength(1);
		});
	});

	describe('update', () => {
		it('should PATCH with update fields', async () => {
			const { ctx, requestCalls } = createMockExecuteFunctions({
				nodeParameters: { initiativeId: 'init1', updateFields: { name: 'Q2 Goals' } },
				httpResponse: { id: 'init1', name: 'Q2 Goals' },
			});

			const result = await initiativeUpdate.call(ctx);

			expect(requestCalls[0].method).toBe('PATCH');
			expect(requestCalls[0].url).toBe(`${BASE}/init1/`);
			expect(result[0].json.name).toBe('Q2 Goals');
		});
	});

	describe('delete', () => {
		it('should DELETE by initiative ID', async () => {
			const { ctx, requestCalls } = createMockExecuteFunctions({
				nodeParameters: { initiativeId: 'init1' },
				httpResponse: undefined,
			});

			const result = await initiativeDelete.call(ctx);

			expect(requestCalls[0].method).toBe('DELETE');
			expect(requestCalls[0].url).toBe(`${BASE}/init1/`);
			expect(result[0].json).toEqual({ success: true });
		});
	});
});
