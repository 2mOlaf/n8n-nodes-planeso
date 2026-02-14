import { describe, it, expect } from 'bun:test';
import {
	customPropertyOptionCreate,
	customPropertyOptionGet,
	customPropertyOptionGetAll,
	customPropertyOptionUpdate,
	customPropertyOptionDelete,
} from '../../nodes/Plane/resources/customPropertyOption';
import { createMockExecuteFunctions } from '../helpers/mockExecuteFunctions';

const BASE = '/api/v1/workspaces/test-workspace/projects/p1/work-item-properties/prop1/options';

describe('CustomPropertyOption', () => {
	describe('create', () => {
		it('should POST with required fields', async () => {
			const { ctx, requestCalls } = createMockExecuteFunctions({
				nodeParameters: { projectId: 'p1', propertyId: 'prop1', name: 'Option A', additionalFields: {} },
				httpResponse: { id: 'opt1', name: 'Option A' },
			});

			const result = await customPropertyOptionCreate.call(ctx);

			expect(requestCalls[0].method).toBe('POST');
			expect(requestCalls[0].url).toBe(`${BASE}/`);
			expect(requestCalls[0].body).toEqual({ name: 'Option A' });
			expect(result[0].json.id).toBe('opt1');
		});
	});

	describe('get', () => {
		it('should GET by option ID', async () => {
			const { ctx, requestCalls } = createMockExecuteFunctions({
				nodeParameters: { projectId: 'p1', propertyId: 'prop1', optionId: 'opt1' },
				httpResponse: { id: 'opt1' },
			});

			const result = await customPropertyOptionGet.call(ctx);

			expect(requestCalls[0].method).toBe('GET');
			expect(requestCalls[0].url).toBe(`${BASE}/opt1/`);
			expect(result[0].json.id).toBe('opt1');
		});
	});

	describe('getAll', () => {
		it('should GET all options', async () => {
			const { ctx, requestCalls } = createMockExecuteFunctions({
				nodeParameters: { projectId: 'p1', propertyId: 'prop1', returnAll: false, limit: 50 },
				httpResponse: [{ id: 'opt1' }],
			});

			const result = await customPropertyOptionGetAll.call(ctx);

			expect(requestCalls[0].method).toBe('GET');
			expect(requestCalls[0].url).toBe(`${BASE}/`);
			expect(result).toHaveLength(1);
		});
	});

	describe('update', () => {
		it('should PATCH with update fields', async () => {
			const { ctx, requestCalls } = createMockExecuteFunctions({
				nodeParameters: { projectId: 'p1', propertyId: 'prop1', optionId: 'opt1', updateFields: { name: 'Option B' } },
				httpResponse: { id: 'opt1', name: 'Option B' },
			});

			const result = await customPropertyOptionUpdate.call(ctx);

			expect(requestCalls[0].method).toBe('PATCH');
			expect(requestCalls[0].url).toBe(`${BASE}/opt1/`);
			expect(result[0].json.name).toBe('Option B');
		});
	});

	describe('delete', () => {
		it('should DELETE by option ID', async () => {
			const { ctx, requestCalls } = createMockExecuteFunctions({
				nodeParameters: { projectId: 'p1', propertyId: 'prop1', optionId: 'opt1' },
				httpResponse: undefined,
			});

			const result = await customPropertyOptionDelete.call(ctx);

			expect(requestCalls[0].method).toBe('DELETE');
			expect(requestCalls[0].url).toBe(`${BASE}/opt1/`);
			expect(result[0].json).toEqual({ success: true });
		});
	});
});
