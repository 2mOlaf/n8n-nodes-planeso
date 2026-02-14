import { describe, it, expect } from 'bun:test';
import {
	projectCreate,
	projectGet,
	projectGetAll,
	projectUpdate,
	projectDelete,
} from '../../nodes/Plane/resources/project';
import { createMockExecuteFunctions } from '../helpers/mockExecuteFunctions';

const BASE = '/api/v1/workspaces/test-workspace/projects';

describe('Project', () => {
	describe('create', () => {
		it('should POST with required fields', async () => {
			const created = { id: 'p1', name: 'My Project', identifier: 'MP' };
			const { ctx, requestCalls } = createMockExecuteFunctions({
				nodeParameters: { name: 'My Project', identifier: 'MP', additionalFields: {} },
				httpResponse: created,
			});

			const result = await projectCreate.call(ctx);

			expect(requestCalls).toHaveLength(1);
			expect(requestCalls[0].method).toBe('POST');
			expect(requestCalls[0].url).toBe(`${BASE}/`);
			expect(requestCalls[0].body).toEqual({ name: 'My Project', identifier: 'MP' });
			expect(result[0].json).toEqual(created);
		});

		it('should include additional fields', async () => {
			const { ctx, requestCalls } = createMockExecuteFunctions({
				nodeParameters: {
					name: 'P',
					identifier: 'P',
					additionalFields: { description: 'desc', network: 2 },
				},
				httpResponse: { id: 'p1' },
			});

			await projectCreate.call(ctx);

			expect(requestCalls[0].body).toEqual({
				name: 'P',
				identifier: 'P',
				description: 'desc',
				network: 2,
			});
		});
	});

	describe('get', () => {
		it('should GET by project ID', async () => {
			const project = { id: 'p1', name: 'Test' };
			const { ctx, requestCalls } = createMockExecuteFunctions({
				nodeParameters: { projectId: 'p1' },
				httpResponse: project,
			});

			const result = await projectGet.call(ctx);

			expect(requestCalls[0].method).toBe('GET');
			expect(requestCalls[0].url).toBe(`${BASE}/p1/`);
			expect(result[0].json).toEqual(project);
		});
	});

	describe('getAll', () => {
		it('should GET all projects with pagination', async () => {
			const response = { results: [{ id: 'p1' }], next_cursor: undefined, next_page_results: false };
			const { ctx, requestCalls } = createMockExecuteFunctions({
				nodeParameters: { returnAll: false, limit: 50 },
				httpResponse: response,
			});

			const result = await projectGetAll.call(ctx);

			expect(requestCalls[0].method).toBe('GET');
			expect(requestCalls[0].url).toBe(`${BASE}/`);
			expect(result).toHaveLength(1);
		});
	});

	describe('update', () => {
		it('should PATCH with update fields', async () => {
			const updated = { id: 'p1', name: 'Updated' };
			const { ctx, requestCalls } = createMockExecuteFunctions({
				nodeParameters: { projectId: 'p1', updateFields: { name: 'Updated' } },
				httpResponse: updated,
			});

			const result = await projectUpdate.call(ctx);

			expect(requestCalls[0].method).toBe('PATCH');
			expect(requestCalls[0].url).toBe(`${BASE}/p1/`);
			expect(requestCalls[0].body).toEqual({ name: 'Updated' });
			expect(result[0].json).toEqual(updated);
		});
	});

	describe('delete', () => {
		it('should DELETE by project ID', async () => {
			const { ctx, requestCalls } = createMockExecuteFunctions({
				nodeParameters: { projectId: 'p1' },
				httpResponse: undefined,
			});

			const result = await projectDelete.call(ctx);

			expect(requestCalls[0].method).toBe('DELETE');
			expect(requestCalls[0].url).toBe(`${BASE}/p1/`);
			expect(result[0].json).toEqual({ success: true });
		});
	});
});
