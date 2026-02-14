import { describe, it, expect } from 'bun:test';
import {
	workItemTypeCreate,
	workItemTypeGet,
	workItemTypeGetAll,
	workItemTypeUpdate,
	workItemTypeDelete,
} from '../../nodes/Plane/resources/workItemType';
import { createMockExecuteFunctions } from '../helpers/mockExecuteFunctions';

const BASE = '/api/v1/workspaces/test-workspace/projects/p1/work-item-types';

describe('WorkItemType', () => {
	describe('create', () => {
		it('should POST with fields', async () => {
			const { ctx, requestCalls } = createMockExecuteFunctions({
				nodeParameters: { projectId: 'p1', additionalFields: { name: 'Bug', description: 'Bug type' } },
				httpResponse: { id: 'wt1', name: 'Bug' },
			});

			const result = await workItemTypeCreate.call(ctx);

			expect(requestCalls[0].method).toBe('POST');
			expect(requestCalls[0].url).toBe(`${BASE}/`);
			expect(requestCalls[0].body).toEqual({ name: 'Bug', description: 'Bug type' });
			expect(result[0].json.id).toBe('wt1');
		});
	});

	describe('get', () => {
		it('should GET by type ID', async () => {
			const { ctx, requestCalls } = createMockExecuteFunctions({
				nodeParameters: { projectId: 'p1', typeId: 'wt1' },
				httpResponse: { id: 'wt1' },
			});

			const result = await workItemTypeGet.call(ctx);

			expect(requestCalls[0].method).toBe('GET');
			expect(requestCalls[0].url).toBe(`${BASE}/wt1/`);
			expect(result[0].json.id).toBe('wt1');
		});
	});

	describe('getAll', () => {
		it('should GET all types', async () => {
			const { ctx, requestCalls } = createMockExecuteFunctions({
				nodeParameters: { projectId: 'p1', returnAll: false, limit: 50 },
				httpResponse: [{ id: 'wt1' }],
			});

			const result = await workItemTypeGetAll.call(ctx);

			expect(requestCalls[0].method).toBe('GET');
			expect(requestCalls[0].url).toBe(`${BASE}/`);
			expect(result).toHaveLength(1);
		});
	});

	describe('update', () => {
		it('should PATCH with update fields', async () => {
			const { ctx, requestCalls } = createMockExecuteFunctions({
				nodeParameters: { projectId: 'p1', typeId: 'wt1', updateFields: { name: 'Feature' } },
				httpResponse: { id: 'wt1', name: 'Feature' },
			});

			const result = await workItemTypeUpdate.call(ctx);

			expect(requestCalls[0].method).toBe('PATCH');
			expect(requestCalls[0].url).toBe(`${BASE}/wt1/`);
			expect(result[0].json.name).toBe('Feature');
		});
	});

	describe('delete', () => {
		it('should DELETE by type ID', async () => {
			const { ctx, requestCalls } = createMockExecuteFunctions({
				nodeParameters: { projectId: 'p1', typeId: 'wt1' },
				httpResponse: '',
			});

			const result = await workItemTypeDelete.call(ctx);

			expect(requestCalls[0].method).toBe('DELETE');
			expect(requestCalls[0].url).toBe(`${BASE}/wt1/`);
			expect(result).toHaveLength(1);
		});
	});
});
