import { describe, it, expect } from 'bun:test';
import { cycleCreate, cycleGet, cycleGetAll, cycleUpdate, cycleDelete } from '../../nodes/Plane/resources/cycle';
import { createMockExecuteFunctions } from '../helpers/mockExecuteFunctions';

const BASE = '/api/v1/workspaces/test-workspace/projects/p1/cycles';

describe('Cycle', () => {
	describe('create', () => {
		it('should POST with required fields', async () => {
			const { ctx, requestCalls } = createMockExecuteFunctions({
				nodeParameters: { projectId: 'p1', name: 'Sprint 1', additionalFields: {} },
				httpResponse: { id: 'c1', name: 'Sprint 1' },
			});

			const result = await cycleCreate.call(ctx);

			expect(requestCalls[0].method).toBe('POST');
			expect(requestCalls[0].url).toBe(`${BASE}/`);
			expect(requestCalls[0].body).toEqual({ name: 'Sprint 1' });
			expect(result[0].json.id).toBe('c1');
		});

		it('should include additional fields', async () => {
			const { ctx, requestCalls } = createMockExecuteFunctions({
				nodeParameters: { projectId: 'p1', name: 'Sprint 1', additionalFields: { start_date: '2025-01-01', end_date: '2025-01-14' } },
				httpResponse: { id: 'c1' },
			});

			await cycleCreate.call(ctx);

			expect(requestCalls[0].body).toEqual({ name: 'Sprint 1', start_date: '2025-01-01', end_date: '2025-01-14' });
		});
	});

	describe('get', () => {
		it('should GET by cycle ID', async () => {
			const { ctx, requestCalls } = createMockExecuteFunctions({
				nodeParameters: { projectId: 'p1', cycleId: 'c1' },
				httpResponse: { id: 'c1' },
			});

			const result = await cycleGet.call(ctx);

			expect(requestCalls[0].method).toBe('GET');
			expect(requestCalls[0].url).toBe(`${BASE}/c1/`);
			expect(result[0].json.id).toBe('c1');
		});
	});

	describe('getAll', () => {
		it('should GET all cycles', async () => {
			const { ctx, requestCalls } = createMockExecuteFunctions({
				nodeParameters: { projectId: 'p1', returnAll: false, limit: 50 },
				httpResponse: [{ id: 'c1' }],
			});

			const result = await cycleGetAll.call(ctx);

			expect(requestCalls[0].method).toBe('GET');
			expect(requestCalls[0].url).toBe(`${BASE}/`);
			expect(result).toHaveLength(1);
		});
	});

	describe('update', () => {
		it('should PATCH with update fields', async () => {
			const { ctx, requestCalls } = createMockExecuteFunctions({
				nodeParameters: { projectId: 'p1', cycleId: 'c1', updateFields: { name: 'Sprint 2' } },
				httpResponse: { id: 'c1', name: 'Sprint 2' },
			});

			const result = await cycleUpdate.call(ctx);

			expect(requestCalls[0].method).toBe('PATCH');
			expect(requestCalls[0].url).toBe(`${BASE}/c1/`);
			expect(result[0].json.name).toBe('Sprint 2');
		});
	});

	describe('delete', () => {
		it('should DELETE by cycle ID', async () => {
			const { ctx, requestCalls } = createMockExecuteFunctions({
				nodeParameters: { projectId: 'p1', cycleId: 'c1' },
				httpResponse: undefined,
			});

			const result = await cycleDelete.call(ctx);

			expect(requestCalls[0].method).toBe('DELETE');
			expect(requestCalls[0].url).toBe(`${BASE}/c1/`);
			expect(result[0].json).toEqual({ success: true });
		});
	});
});
