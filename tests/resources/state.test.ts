import { describe, it, expect } from 'bun:test';
import { stateCreate, stateGet, stateGetAll, stateUpdate, stateDelete } from '../../nodes/Plane/resources/state';
import { createMockExecuteFunctions } from '../helpers/mockExecuteFunctions';

const BASE = '/api/v1/workspaces/test-workspace/projects/p1/states';

describe('State', () => {
	describe('create', () => {
		it('should POST with required fields', async () => {
			const created = { id: 's1', name: 'Todo', color: '#000', group: 'backlog' };
			const { ctx, requestCalls } = createMockExecuteFunctions({
				nodeParameters: { projectId: 'p1', name: 'Todo', color: '#000', group: 'backlog', additionalFields: {} },
				httpResponse: created,
			});

			const result = await stateCreate.call(ctx);

			expect(requestCalls[0].method).toBe('POST');
			expect(requestCalls[0].url).toBe(`${BASE}/`);
			expect(requestCalls[0].body).toEqual({ name: 'Todo', color: '#000', group: 'backlog' });
			expect(result[0].json).toEqual(created);
		});
	});

	describe('get', () => {
		it('should GET by state ID', async () => {
			const state = { id: 's1', name: 'Todo' };
			const { ctx, requestCalls } = createMockExecuteFunctions({
				nodeParameters: { projectId: 'p1', stateId: 's1' },
				httpResponse: state,
			});

			const result = await stateGet.call(ctx);

			expect(requestCalls[0].method).toBe('GET');
			expect(requestCalls[0].url).toBe(`${BASE}/s1/`);
			expect(result[0].json).toEqual(state);
		});
	});

	describe('getAll', () => {
		it('should GET all states', async () => {
			const { ctx, requestCalls } = createMockExecuteFunctions({
				nodeParameters: { projectId: 'p1', returnAll: false, limit: 50 },
				httpResponse: [{ id: 's1' }, { id: 's2' }],
			});

			const result = await stateGetAll.call(ctx);

			expect(requestCalls[0].method).toBe('GET');
			expect(requestCalls[0].url).toBe(`${BASE}/`);
			expect(result).toHaveLength(2);
		});
	});

	describe('update', () => {
		it('should PATCH with update fields', async () => {
			const { ctx, requestCalls } = createMockExecuteFunctions({
				nodeParameters: { projectId: 'p1', stateId: 's1', updateFields: { name: 'Done' } },
				httpResponse: { id: 's1', name: 'Done' },
			});

			const result = await stateUpdate.call(ctx);

			expect(requestCalls[0].method).toBe('PATCH');
			expect(requestCalls[0].url).toBe(`${BASE}/s1/`);
			expect(requestCalls[0].body).toEqual({ name: 'Done' });
			expect(result[0].json.name).toBe('Done');
		});
	});

	describe('delete', () => {
		it('should DELETE by state ID', async () => {
			const { ctx, requestCalls } = createMockExecuteFunctions({
				nodeParameters: { projectId: 'p1', stateId: 's1' },
				httpResponse: undefined,
			});

			const result = await stateDelete.call(ctx);

			expect(requestCalls[0].method).toBe('DELETE');
			expect(requestCalls[0].url).toBe(`${BASE}/s1/`);
			expect(result[0].json).toEqual({ success: true });
		});
	});
});
