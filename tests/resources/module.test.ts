import { describe, it, expect } from 'bun:test';
import { moduleCreate, moduleGet, moduleGetAll, moduleUpdate, moduleDelete } from '../../nodes/Plane/resources/module';
import { createMockExecuteFunctions } from '../helpers/mockExecuteFunctions';

const BASE = '/api/v1/workspaces/test-workspace/projects/p1/modules';

describe('Module', () => {
	describe('create', () => {
		it('should POST with required fields', async () => {
			const { ctx, requestCalls } = createMockExecuteFunctions({
				nodeParameters: { projectId: 'p1', name: 'Auth Module', additionalFields: {} },
				httpResponse: { id: 'm1', name: 'Auth Module' },
			});

			const result = await moduleCreate.call(ctx);

			expect(requestCalls[0].method).toBe('POST');
			expect(requestCalls[0].url).toBe(`${BASE}/`);
			expect(requestCalls[0].body).toEqual({ name: 'Auth Module' });
			expect(result[0].json.id).toBe('m1');
		});
	});

	describe('get', () => {
		it('should GET by module ID', async () => {
			const { ctx, requestCalls } = createMockExecuteFunctions({
				nodeParameters: { projectId: 'p1', moduleId: 'm1' },
				httpResponse: { id: 'm1' },
			});

			const result = await moduleGet.call(ctx);

			expect(requestCalls[0].method).toBe('GET');
			expect(requestCalls[0].url).toBe(`${BASE}/m1/`);
			expect(result[0].json.id).toBe('m1');
		});
	});

	describe('getAll', () => {
		it('should GET all modules', async () => {
			const { ctx, requestCalls } = createMockExecuteFunctions({
				nodeParameters: { projectId: 'p1', returnAll: false, limit: 50 },
				httpResponse: [{ id: 'm1' }],
			});

			const result = await moduleGetAll.call(ctx);

			expect(requestCalls[0].method).toBe('GET');
			expect(requestCalls[0].url).toBe(`${BASE}/`);
			expect(result).toHaveLength(1);
		});
	});

	describe('update', () => {
		it('should PATCH with update fields', async () => {
			const { ctx, requestCalls } = createMockExecuteFunctions({
				nodeParameters: { projectId: 'p1', moduleId: 'm1', updateFields: { name: 'Payments' } },
				httpResponse: { id: 'm1', name: 'Payments' },
			});

			const result = await moduleUpdate.call(ctx);

			expect(requestCalls[0].method).toBe('PATCH');
			expect(requestCalls[0].url).toBe(`${BASE}/m1/`);
			expect(result[0].json.name).toBe('Payments');
		});
	});

	describe('delete', () => {
		it('should DELETE by module ID', async () => {
			const { ctx, requestCalls } = createMockExecuteFunctions({
				nodeParameters: { projectId: 'p1', moduleId: 'm1' },
				httpResponse: undefined,
			});

			const result = await moduleDelete.call(ctx);

			expect(requestCalls[0].method).toBe('DELETE');
			expect(requestCalls[0].url).toBe(`${BASE}/m1/`);
			expect(result[0].json).toEqual({ success: true });
		});
	});
});
