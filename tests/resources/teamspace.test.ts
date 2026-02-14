import { describe, it, expect } from 'bun:test';
import { teamspaceCreate, teamspaceGet, teamspaceGetAll, teamspaceUpdate, teamspaceDelete } from '../../nodes/Plane/resources/teamspace';
import { createMockExecuteFunctions } from '../helpers/mockExecuteFunctions';

const BASE = '/api/v1/workspaces/test-workspace/teamspaces';

describe('Teamspace', () => {
	describe('create', () => {
		it('should POST with required fields', async () => {
			const { ctx, requestCalls } = createMockExecuteFunctions({
				nodeParameters: { name: 'Engineering', additionalFields: {} },
				httpResponse: { id: 'ts1', name: 'Engineering' },
			});

			const result = await teamspaceCreate.call(ctx);

			expect(requestCalls[0].method).toBe('POST');
			expect(requestCalls[0].url).toBe(`${BASE}/`);
			expect(requestCalls[0].body).toEqual({ name: 'Engineering' });
			expect(result[0].json.id).toBe('ts1');
		});
	});

	describe('get', () => {
		it('should GET by teamspace ID', async () => {
			const { ctx, requestCalls } = createMockExecuteFunctions({
				nodeParameters: { teamspaceId: 'ts1' },
				httpResponse: { id: 'ts1' },
			});

			const result = await teamspaceGet.call(ctx);

			expect(requestCalls[0].method).toBe('GET');
			expect(requestCalls[0].url).toBe(`${BASE}/ts1/`);
			expect(result[0].json.id).toBe('ts1');
		});
	});

	describe('getAll', () => {
		it('should GET all teamspaces', async () => {
			const { ctx, requestCalls } = createMockExecuteFunctions({
				nodeParameters: { returnAll: false, limit: 50 },
				httpResponse: [{ id: 'ts1' }],
			});

			const result = await teamspaceGetAll.call(ctx);

			expect(requestCalls[0].method).toBe('GET');
			expect(requestCalls[0].url).toBe(`${BASE}/`);
			expect(result).toHaveLength(1);
		});
	});

	describe('update', () => {
		it('should PATCH with update fields', async () => {
			const { ctx, requestCalls } = createMockExecuteFunctions({
				nodeParameters: { teamspaceId: 'ts1', updateFields: { name: 'Product' } },
				httpResponse: { id: 'ts1', name: 'Product' },
			});

			const result = await teamspaceUpdate.call(ctx);

			expect(requestCalls[0].method).toBe('PATCH');
			expect(requestCalls[0].url).toBe(`${BASE}/ts1/`);
			expect(result[0].json.name).toBe('Product');
		});
	});

	describe('delete', () => {
		it('should DELETE by teamspace ID', async () => {
			const { ctx, requestCalls } = createMockExecuteFunctions({
				nodeParameters: { teamspaceId: 'ts1' },
				httpResponse: undefined,
			});

			const result = await teamspaceDelete.call(ctx);

			expect(requestCalls[0].method).toBe('DELETE');
			expect(requestCalls[0].url).toBe(`${BASE}/ts1/`);
			expect(result[0].json).toEqual({ success: true });
		});
	});
});
