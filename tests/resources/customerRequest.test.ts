import { describe, it, expect } from 'bun:test';
import {
	customerRequestCreate,
	customerRequestGet,
	customerRequestGetAll,
	customerRequestUpdate,
	customerRequestDelete,
} from '../../nodes/Plane/resources/customerRequest';
import { createMockExecuteFunctions } from '../helpers/mockExecuteFunctions';

const BASE = '/api/v1/workspaces/test-workspace/customers/cust1/requests';

describe('CustomerRequest', () => {
	describe('create', () => {
		it('should POST with fields', async () => {
			const { ctx, requestCalls } = createMockExecuteFunctions({
				nodeParameters: { customerId: 'cust1', additionalFields: { title: 'Need dark mode' } },
				httpResponse: { id: 'cr1', title: 'Need dark mode' },
			});

			const result = await customerRequestCreate.call(ctx);

			expect(requestCalls[0].method).toBe('POST');
			expect(requestCalls[0].url).toBe(`${BASE}/`);
			expect(requestCalls[0].body).toEqual({ title: 'Need dark mode' });
			expect(result[0].json.id).toBe('cr1');
		});
	});

	describe('get', () => {
		it('should GET by request ID', async () => {
			const { ctx, requestCalls } = createMockExecuteFunctions({
				nodeParameters: { customerId: 'cust1', requestId: 'cr1' },
				httpResponse: { id: 'cr1' },
			});

			const result = await customerRequestGet.call(ctx);

			expect(requestCalls[0].method).toBe('GET');
			expect(requestCalls[0].url).toBe(`${BASE}/cr1/`);
			expect(result[0].json.id).toBe('cr1');
		});
	});

	describe('getAll', () => {
		it('should GET all requests for customer', async () => {
			const { ctx, requestCalls } = createMockExecuteFunctions({
				nodeParameters: { customerId: 'cust1', returnAll: false, limit: 50 },
				httpResponse: [{ id: 'cr1' }],
			});

			const result = await customerRequestGetAll.call(ctx);

			expect(requestCalls[0].method).toBe('GET');
			expect(requestCalls[0].url).toBe(`${BASE}/`);
			expect(result).toHaveLength(1);
		});
	});

	describe('update', () => {
		it('should PATCH with update fields', async () => {
			const { ctx, requestCalls } = createMockExecuteFunctions({
				nodeParameters: { customerId: 'cust1', requestId: 'cr1', updateFields: { title: 'Updated request' } },
				httpResponse: { id: 'cr1', title: 'Updated request' },
			});

			const result = await customerRequestUpdate.call(ctx);

			expect(requestCalls[0].method).toBe('PATCH');
			expect(requestCalls[0].url).toBe(`${BASE}/cr1/`);
			expect(result[0].json.title).toBe('Updated request');
		});
	});

	describe('delete', () => {
		it('should DELETE by request ID', async () => {
			const { ctx, requestCalls } = createMockExecuteFunctions({
				nodeParameters: { customerId: 'cust1', requestId: 'cr1' },
				httpResponse: undefined,
			});

			const result = await customerRequestDelete.call(ctx);

			expect(requestCalls[0].method).toBe('DELETE');
			expect(requestCalls[0].url).toBe(`${BASE}/cr1/`);
			expect(result[0].json).toEqual({ success: true });
		});
	});
});
