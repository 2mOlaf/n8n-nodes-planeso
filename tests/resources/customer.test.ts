import { describe, it, expect } from 'bun:test';
import {
	customerCreate,
	customerGet,
	customerGetAll,
	customerUpdate,
	customerDelete,
	customerLinkWorkItems,
	customerUnlinkWorkItem,
	customerGetWorkItems,
} from '../../nodes/Plane/resources/customer';
import { createMockExecuteFunctions } from '../helpers/mockExecuteFunctions';

const BASE = '/api/v1/workspaces/test-workspace/customers';

describe('Customer', () => {
	describe('create', () => {
		it('should POST with fields', async () => {
			const { ctx, requestCalls } = createMockExecuteFunctions({
				nodeParameters: { additionalFields: { name: 'Acme Corp', email: 'acme@example.com' } },
				httpResponse: { id: 'cust1', name: 'Acme Corp' },
			});

			const result = await customerCreate.call(ctx);

			expect(requestCalls[0].method).toBe('POST');
			expect(requestCalls[0].url).toBe(`${BASE}/`);
			expect(requestCalls[0].body).toEqual({ name: 'Acme Corp', email: 'acme@example.com' });
			expect(result[0].json.id).toBe('cust1');
		});
	});

	describe('get', () => {
		it('should GET by customer ID', async () => {
			const { ctx, requestCalls } = createMockExecuteFunctions({
				nodeParameters: { customerId: 'cust1' },
				httpResponse: { id: 'cust1' },
			});

			const result = await customerGet.call(ctx);

			expect(requestCalls[0].method).toBe('GET');
			expect(requestCalls[0].url).toBe(`${BASE}/cust1/`);
			expect(result[0].json.id).toBe('cust1');
		});
	});

	describe('getAll', () => {
		it('should GET all customers', async () => {
			const { ctx, requestCalls } = createMockExecuteFunctions({
				nodeParameters: { returnAll: false, limit: 50 },
				httpResponse: [{ id: 'cust1' }],
			});

			const result = await customerGetAll.call(ctx);

			expect(requestCalls[0].method).toBe('GET');
			expect(requestCalls[0].url).toBe(`${BASE}/`);
			expect(result).toHaveLength(1);
		});
	});

	describe('update', () => {
		it('should PATCH with update fields', async () => {
			const { ctx, requestCalls } = createMockExecuteFunctions({
				nodeParameters: { customerId: 'cust1', updateFields: { name: 'Acme Inc' } },
				httpResponse: { id: 'cust1', name: 'Acme Inc' },
			});

			const result = await customerUpdate.call(ctx);

			expect(requestCalls[0].method).toBe('PATCH');
			expect(requestCalls[0].url).toBe(`${BASE}/cust1/`);
			expect(result[0].json.name).toBe('Acme Inc');
		});
	});

	describe('delete', () => {
		it('should DELETE by customer ID', async () => {
			const { ctx, requestCalls } = createMockExecuteFunctions({
				nodeParameters: { customerId: 'cust1' },
				httpResponse: undefined,
			});

			const result = await customerDelete.call(ctx);

			expect(requestCalls[0].method).toBe('DELETE');
			expect(requestCalls[0].url).toBe(`${BASE}/cust1/`);
			expect(result[0].json).toEqual({ success: true });
		});
	});

	describe('linkWorkItems', () => {
		it('should POST work item IDs to customer', async () => {
			const { ctx, requestCalls } = createMockExecuteFunctions({
				nodeParameters: { customerId: 'cust1', work_item_ids: 'wi1,wi2' },
				httpResponse: [{ id: 'wi1' }, { id: 'wi2' }],
			});

			const result = await customerLinkWorkItems.call(ctx);

			expect(requestCalls[0].method).toBe('POST');
			expect(requestCalls[0].url).toBe(`${BASE}/cust1/work-items/`);
			expect(requestCalls[0].body).toEqual({ work_item_ids: ['wi1', 'wi2'] });
			expect(result).toHaveLength(2);
		});
	});

	describe('unlinkWorkItem', () => {
		it('should DELETE a work item from customer', async () => {
			const { ctx, requestCalls } = createMockExecuteFunctions({
				nodeParameters: { customerId: 'cust1', workItemId: 'wi1' },
				httpResponse: undefined,
			});

			const result = await customerUnlinkWorkItem.call(ctx);

			expect(requestCalls[0].method).toBe('DELETE');
			expect(requestCalls[0].url).toBe(`${BASE}/cust1/work-items/wi1/`);
			expect(result[0].json).toEqual({ success: true });
		});
	});

	describe('getWorkItems', () => {
		it('should GET work items linked to customer', async () => {
			const { ctx, requestCalls } = createMockExecuteFunctions({
				nodeParameters: { customerId: 'cust1', returnAll: false, limit: 50 },
				httpResponse: [{ id: 'wi1' }],
			});

			const result = await customerGetWorkItems.call(ctx);

			expect(requestCalls[0].method).toBe('GET');
			expect(requestCalls[0].url).toBe(`${BASE}/cust1/work-items/`);
			expect(result).toHaveLength(1);
		});
	});
});
