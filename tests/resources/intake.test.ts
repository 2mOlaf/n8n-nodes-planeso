import { describe, it, expect } from 'bun:test';
import { intakeCreate, intakeGet, intakeGetAll, intakeUpdate, intakeDelete } from '../../nodes/Plane/resources/intake';
import { createMockExecuteFunctions } from '../helpers/mockExecuteFunctions';

const BASE = '/api/v1/workspaces/test-workspace/intake-issues';

describe('Intake', () => {
	describe('create', () => {
		it('should POST with fields', async () => {
			const { ctx, requestCalls } = createMockExecuteFunctions({
				nodeParameters: { additionalFields: { name: 'New issue', priority: 'high' } },
				httpResponse: { id: 'i1', name: 'New issue' },
			});

			const result = await intakeCreate.call(ctx);

			expect(requestCalls[0].method).toBe('POST');
			expect(requestCalls[0].url).toBe(`${BASE}/`);
			expect(requestCalls[0].body).toEqual({ name: 'New issue', priority: 'high' });
			expect(result[0].json.id).toBe('i1');
		});
	});

	describe('get', () => {
		it('should GET by intake ID', async () => {
			const { ctx, requestCalls } = createMockExecuteFunctions({
				nodeParameters: { intakeId: 'i1' },
				httpResponse: { id: 'i1' },
			});

			const result = await intakeGet.call(ctx);

			expect(requestCalls[0].method).toBe('GET');
			expect(requestCalls[0].url).toBe(`${BASE}/i1/`);
			expect(result[0].json.id).toBe('i1');
		});
	});

	describe('getAll', () => {
		it('should GET all intake issues', async () => {
			const { ctx, requestCalls } = createMockExecuteFunctions({
				nodeParameters: { returnAll: false, limit: 50 },
				httpResponse: [{ id: 'i1' }],
			});

			const result = await intakeGetAll.call(ctx);

			expect(requestCalls[0].method).toBe('GET');
			expect(requestCalls[0].url).toBe(`${BASE}/`);
			expect(result).toHaveLength(1);
		});
	});

	describe('update', () => {
		it('should PATCH with update fields', async () => {
			const { ctx, requestCalls } = createMockExecuteFunctions({
				nodeParameters: { intakeId: 'i1', updateFields: { name: 'Updated' } },
				httpResponse: { id: 'i1', name: 'Updated' },
			});

			const result = await intakeUpdate.call(ctx);

			expect(requestCalls[0].method).toBe('PATCH');
			expect(requestCalls[0].url).toBe(`${BASE}/i1/`);
			expect(result[0].json.name).toBe('Updated');
		});
	});

	describe('delete', () => {
		it('should DELETE by intake ID', async () => {
			const { ctx, requestCalls } = createMockExecuteFunctions({
				nodeParameters: { intakeId: 'i1' },
				httpResponse: undefined,
			});

			const result = await intakeDelete.call(ctx);

			expect(requestCalls[0].method).toBe('DELETE');
			expect(requestCalls[0].url).toBe(`${BASE}/i1/`);
			expect(result[0].json).toEqual({ success: true });
		});
	});
});
