import { describe, it, expect } from 'bun:test';
import {
	workItemCreate,
	workItemGet,
	workItemGetByIdentifier,
	workItemGetAll,
	workItemSearch,
	workItemUpdate,
	workItemDelete,
} from '../../nodes/Plane/resources/workItem';
import { createMockExecuteFunctions } from '../helpers/mockExecuteFunctions';

const BASE = '/api/v1/workspaces/test-workspace/projects/p1/work-items';

describe('WorkItem', () => {
	describe('create', () => {
		it('should POST with required fields', async () => {
			const created = { id: 'wi1', name: 'Fix bug' };
			const { ctx, requestCalls } = createMockExecuteFunctions({
				nodeParameters: { projectId: 'p1', name: 'Fix bug', additionalFields: {} },
				httpResponse: created,
			});

			const result = await workItemCreate.call(ctx);

			expect(requestCalls[0].method).toBe('POST');
			expect(requestCalls[0].url).toBe(`${BASE}/`);
			expect(requestCalls[0].body).toEqual({ name: 'Fix bug' });
			expect(result[0].json).toEqual(created);
		});

		it('should include additional fields', async () => {
			const { ctx, requestCalls } = createMockExecuteFunctions({
				nodeParameters: {
					projectId: 'p1',
					name: 'Task',
					additionalFields: { priority: 'high', state: 's1', assignees: 'u1,u2' },
				},
				httpResponse: { id: 'wi1' },
			});

			await workItemCreate.call(ctx);

			expect(requestCalls[0].body).toEqual({
				name: 'Task',
				priority: 'high',
				state: 's1',
				assignees: ['u1', 'u2'],
			});
		});
	});

	describe('get', () => {
		it('should GET by work item ID', async () => {
			const { ctx, requestCalls } = createMockExecuteFunctions({
				nodeParameters: { projectId: 'p1', workItemId: 'wi1' },
				httpResponse: { id: 'wi1' },
			});

			const result = await workItemGet.call(ctx);

			expect(requestCalls[0].method).toBe('GET');
			expect(requestCalls[0].url).toBe(`${BASE}/wi1/`);
			expect(result[0].json.id).toBe('wi1');
		});
	});

	describe('getByIdentifier', () => {
		it('should GET by identifier like PROJECT-123', async () => {
			const { ctx, requestCalls } = createMockExecuteFunctions({
				nodeParameters: { identifier: 'PROJ-42' },
				httpResponse: { id: 'wi1', identifier: 'PROJ-42' },
			});

			const result = await workItemGetByIdentifier.call(ctx);

			expect(requestCalls[0].method).toBe('GET');
			expect(requestCalls[0].url).toBe('/api/v1/workspaces/test-workspace/work-items/PROJ-42/');
			expect(result[0].json.identifier).toBe('PROJ-42');
		});
	});

	describe('getAll', () => {
		it('should GET all work items with cursor pagination', async () => {
			const response = { results: [{ id: 'wi1' }], next_cursor: undefined, next_page_results: false };
			const { ctx, requestCalls } = createMockExecuteFunctions({
				nodeParameters: { projectId: 'p1', returnAll: false, limit: 50 },
				httpResponse: response,
			});

			const result = await workItemGetAll.call(ctx);

			expect(requestCalls[0].method).toBe('GET');
			expect(requestCalls[0].url).toBe(`${BASE}/`);
			expect(result).toHaveLength(1);
		});
	});

	describe('search', () => {
		it('should search work items across workspace', async () => {
			const { ctx, requestCalls } = createMockExecuteFunctions({
				nodeParameters: { search: 'bug fix', returnAll: false, limit: 50 },
				httpResponse: [{ id: 'wi1', name: 'Bug fix' }],
			});

			const result = await workItemSearch.call(ctx);

			expect(requestCalls[0].method).toBe('GET');
			expect(requestCalls[0].url).toBe('/api/v1/workspaces/test-workspace/work-items/search/');
			expect(requestCalls[0].qs?.search).toBe('bug fix');
			expect(result).toHaveLength(1);
		});
	});

	describe('update', () => {
		it('should PATCH with update fields', async () => {
			const { ctx, requestCalls } = createMockExecuteFunctions({
				nodeParameters: { projectId: 'p1', workItemId: 'wi1', updateFields: { name: 'Updated' } },
				httpResponse: { id: 'wi1', name: 'Updated' },
			});

			const result = await workItemUpdate.call(ctx);

			expect(requestCalls[0].method).toBe('PATCH');
			expect(requestCalls[0].url).toBe(`${BASE}/wi1/`);
			expect(requestCalls[0].body).toEqual({ name: 'Updated' });
			expect(result[0].json.name).toBe('Updated');
		});
	});

	describe('delete', () => {
		it('should DELETE by work item ID', async () => {
			const { ctx, requestCalls } = createMockExecuteFunctions({
				nodeParameters: { projectId: 'p1', workItemId: 'wi1' },
				httpResponse: '',
			});

			const result = await workItemDelete.call(ctx);

			expect(requestCalls[0].method).toBe('DELETE');
			expect(requestCalls[0].url).toBe(`${BASE}/wi1/`);
			expect(result).toHaveLength(1);
		});
	});
});
