import { describe, it, expect } from 'bun:test';
import {
	customPropertyCreate,
	customPropertyGet,
	customPropertyGetAll,
	customPropertyUpdate,
	customPropertyDelete,
} from '../../nodes/Plane/resources/customProperty';
import { createMockExecuteFunctions } from '../helpers/mockExecuteFunctions';

const BASE = '/api/v1/workspaces/test-workspace/projects/p1/work-item-types/t1/work-item-properties';

describe('CustomProperty', () => {
	describe('create', () => {
		it('should POST with required fields', async () => {
			const { ctx, requestCalls } = createMockExecuteFunctions({
				nodeParameters: { projectId: 'p1', typeId: 't1', display_name: 'Priority', additionalFields: {} },
				httpResponse: { id: 'cp1', display_name: 'Priority' },
			});

			const result = await customPropertyCreate.call(ctx);

			expect(requestCalls[0].method).toBe('POST');
			expect(requestCalls[0].url).toBe(`${BASE}/`);
			expect(requestCalls[0].body).toEqual({ display_name: 'Priority' });
			expect(result[0].json.id).toBe('cp1');
		});
	});

	describe('get', () => {
		it('should GET by property ID', async () => {
			const { ctx, requestCalls } = createMockExecuteFunctions({
				nodeParameters: { projectId: 'p1', typeId: 't1', propertyId: 'cp1' },
				httpResponse: { id: 'cp1' },
			});

			const result = await customPropertyGet.call(ctx);

			expect(requestCalls[0].method).toBe('GET');
			expect(requestCalls[0].url).toBe(`${BASE}/cp1/`);
			expect(result[0].json.id).toBe('cp1');
		});
	});

	describe('getAll', () => {
		it('should GET all properties', async () => {
			const { ctx, requestCalls } = createMockExecuteFunctions({
				nodeParameters: { projectId: 'p1', typeId: 't1', returnAll: false, limit: 50 },
				httpResponse: [{ id: 'cp1' }],
			});

			const result = await customPropertyGetAll.call(ctx);

			expect(requestCalls[0].method).toBe('GET');
			expect(requestCalls[0].url).toBe(`${BASE}/`);
			expect(result).toHaveLength(1);
		});
	});

	describe('update', () => {
		it('should PATCH with update fields', async () => {
			const { ctx, requestCalls } = createMockExecuteFunctions({
				nodeParameters: { projectId: 'p1', typeId: 't1', propertyId: 'cp1', updateFields: { display_name: 'Severity' } },
				httpResponse: { id: 'cp1', display_name: 'Severity' },
			});

			const result = await customPropertyUpdate.call(ctx);

			expect(requestCalls[0].method).toBe('PATCH');
			expect(requestCalls[0].url).toBe(`${BASE}/cp1/`);
			expect(result[0].json.display_name).toBe('Severity');
		});
	});

	describe('delete', () => {
		it('should DELETE by property ID', async () => {
			const { ctx, requestCalls } = createMockExecuteFunctions({
				nodeParameters: { projectId: 'p1', typeId: 't1', propertyId: 'cp1' },
				httpResponse: undefined,
			});

			const result = await customPropertyDelete.call(ctx);

			expect(requestCalls[0].method).toBe('DELETE');
			expect(requestCalls[0].url).toBe(`${BASE}/cp1/`);
			expect(result[0].json).toEqual({ success: true });
		});
	});
});
