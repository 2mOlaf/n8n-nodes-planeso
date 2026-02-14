import { describe, it, expect } from 'bun:test';
import {
	customerPropertyCreate,
	customerPropertyGet,
	customerPropertyGetAll,
	customerPropertyUpdate,
	customerPropertyDelete,
} from '../../nodes/Plane/resources/customerProperty';
import { createMockExecuteFunctions } from '../helpers/mockExecuteFunctions';

const BASE = '/api/v1/workspaces/test-workspace/customer-properties';

describe('CustomerProperty', () => {
	describe('create', () => {
		it('should POST with required fields', async () => {
			const { ctx, requestCalls } = createMockExecuteFunctions({
				nodeParameters: { display_name: 'Company Size', additionalFields: {} },
				httpResponse: { id: 'cprop1', display_name: 'Company Size' },
			});

			const result = await customerPropertyCreate.call(ctx);

			expect(requestCalls[0].method).toBe('POST');
			expect(requestCalls[0].url).toBe(`${BASE}/`);
			expect(requestCalls[0].body).toEqual({ display_name: 'Company Size' });
			expect(result[0].json.id).toBe('cprop1');
		});
	});

	describe('get', () => {
		it('should GET by property ID', async () => {
			const { ctx, requestCalls } = createMockExecuteFunctions({
				nodeParameters: { propertyId: 'cprop1' },
				httpResponse: { id: 'cprop1' },
			});

			const result = await customerPropertyGet.call(ctx);

			expect(requestCalls[0].method).toBe('GET');
			expect(requestCalls[0].url).toBe(`${BASE}/cprop1/`);
			expect(result[0].json.id).toBe('cprop1');
		});
	});

	describe('getAll', () => {
		it('should GET all customer properties', async () => {
			const { ctx, requestCalls } = createMockExecuteFunctions({
				nodeParameters: { returnAll: false, limit: 50 },
				httpResponse: [{ id: 'cprop1' }],
			});

			const result = await customerPropertyGetAll.call(ctx);

			expect(requestCalls[0].method).toBe('GET');
			expect(requestCalls[0].url).toBe(`${BASE}/`);
			expect(result).toHaveLength(1);
		});
	});

	describe('update', () => {
		it('should PATCH with update fields', async () => {
			const { ctx, requestCalls } = createMockExecuteFunctions({
				nodeParameters: { propertyId: 'cprop1', updateFields: { display_name: 'Revenue' } },
				httpResponse: { id: 'cprop1', display_name: 'Revenue' },
			});

			const result = await customerPropertyUpdate.call(ctx);

			expect(requestCalls[0].method).toBe('PATCH');
			expect(requestCalls[0].url).toBe(`${BASE}/cprop1/`);
			expect(result[0].json.display_name).toBe('Revenue');
		});
	});

	describe('delete', () => {
		it('should DELETE by property ID', async () => {
			const { ctx, requestCalls } = createMockExecuteFunctions({
				nodeParameters: { propertyId: 'cprop1' },
				httpResponse: undefined,
			});

			const result = await customerPropertyDelete.call(ctx);

			expect(requestCalls[0].method).toBe('DELETE');
			expect(requestCalls[0].url).toBe(`${BASE}/cprop1/`);
			expect(result[0].json).toEqual({ success: true });
		});
	});
});
