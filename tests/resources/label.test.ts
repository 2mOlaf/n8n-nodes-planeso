import { describe, it, expect } from 'bun:test';
import { labelCreate, labelGet, labelGetAll, labelUpdate, labelDelete } from '../../nodes/Plane/resources/label';
import { createMockExecuteFunctions } from '../helpers/mockExecuteFunctions';

const BASE = '/api/v1/workspaces/test-workspace/projects/p1/labels';

describe('Label', () => {
	describe('create', () => {
		it('should POST with required fields', async () => {
			const created = { id: 'l1', name: 'Bug' };
			const { ctx, requestCalls } = createMockExecuteFunctions({
				nodeParameters: { projectId: 'p1', name: 'Bug', additionalFields: {} },
				httpResponse: created,
			});

			const result = await labelCreate.call(ctx);

			expect(requestCalls[0].method).toBe('POST');
			expect(requestCalls[0].url).toBe(`${BASE}/`);
			expect(requestCalls[0].body).toEqual({ name: 'Bug' });
			expect(result[0].json).toEqual(created);
		});

		it('should include optional color and description', async () => {
			const { ctx, requestCalls } = createMockExecuteFunctions({
				nodeParameters: { projectId: 'p1', name: 'Bug', additionalFields: { color: '#ff0000', description: 'A bug' } },
				httpResponse: { id: 'l1' },
			});

			await labelCreate.call(ctx);

			expect(requestCalls[0].body).toEqual({ name: 'Bug', color: '#ff0000', description: 'A bug' });
		});
	});

	describe('get', () => {
		it('should GET by label ID', async () => {
			const { ctx, requestCalls } = createMockExecuteFunctions({
				nodeParameters: { projectId: 'p1', labelId: 'l1' },
				httpResponse: { id: 'l1', name: 'Bug' },
			});

			const result = await labelGet.call(ctx);

			expect(requestCalls[0].method).toBe('GET');
			expect(requestCalls[0].url).toBe(`${BASE}/l1/`);
			expect(result[0].json.id).toBe('l1');
		});
	});

	describe('getAll', () => {
		it('should GET all labels', async () => {
			const { ctx, requestCalls } = createMockExecuteFunctions({
				nodeParameters: { projectId: 'p1', returnAll: false, limit: 50 },
				httpResponse: [{ id: 'l1' }],
			});

			const result = await labelGetAll.call(ctx);

			expect(requestCalls[0].method).toBe('GET');
			expect(requestCalls[0].url).toBe(`${BASE}/`);
			expect(result).toHaveLength(1);
		});
	});

	describe('update', () => {
		it('should PATCH with update fields', async () => {
			const { ctx, requestCalls } = createMockExecuteFunctions({
				nodeParameters: { projectId: 'p1', labelId: 'l1', updateFields: { name: 'Feature' } },
				httpResponse: { id: 'l1', name: 'Feature' },
			});

			const result = await labelUpdate.call(ctx);

			expect(requestCalls[0].method).toBe('PATCH');
			expect(requestCalls[0].url).toBe(`${BASE}/l1/`);
			expect(result[0].json.name).toBe('Feature');
		});
	});

	describe('delete', () => {
		it('should DELETE by label ID', async () => {
			const { ctx, requestCalls } = createMockExecuteFunctions({
				nodeParameters: { projectId: 'p1', labelId: 'l1' },
				httpResponse: undefined,
			});

			const result = await labelDelete.call(ctx);

			expect(requestCalls[0].method).toBe('DELETE');
			expect(requestCalls[0].url).toBe(`${BASE}/l1/`);
			expect(result[0].json).toEqual({ success: true });
		});
	});
});
