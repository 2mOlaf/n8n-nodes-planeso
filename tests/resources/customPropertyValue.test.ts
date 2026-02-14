import { describe, it, expect } from 'bun:test';
import { customPropertyValueGetAll, customPropertyValueUpdate } from '../../nodes/Plane/resources/customPropertyValue';
import { createMockExecuteFunctions } from '../helpers/mockExecuteFunctions';

const BASE = '/api/v1/workspaces/test-workspace/projects/p1/work-items/wi1/property-values';

describe('CustomPropertyValue', () => {
	describe('getAll', () => {
		it('should GET all property values for a work item', async () => {
			const values = { prop1: 'val1', prop2: 'val2' };
			const { ctx, requestCalls } = createMockExecuteFunctions({
				nodeParameters: { projectId: 'p1', workItemId: 'wi1', returnAll: false, limit: 50 },
				httpResponse: values,
			});

			const result = await customPropertyValueGetAll.call(ctx);

			expect(requestCalls[0].method).toBe('GET');
			expect(requestCalls[0].url).toBe(`${BASE}/`);
			expect(result).toHaveLength(1);
		});
	});

	describe('update', () => {
		it('should PATCH a property value', async () => {
			const { ctx, requestCalls } = createMockExecuteFunctions({
				nodeParameters: { projectId: 'p1', workItemId: 'wi1', propertyId: 'prop1', value: 'new-val' },
				httpResponse: { prop1: 'new-val' },
			});

			const result = await customPropertyValueUpdate.call(ctx);

			expect(requestCalls[0].method).toBe('PATCH');
			expect(requestCalls[0].url).toBe(`${BASE}/prop1/`);
			expect(result[0].json.prop1).toBe('new-val');
		});
	});
});
