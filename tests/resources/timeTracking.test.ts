import { describe, it, expect } from 'bun:test';
import { timeTrackingCreate, timeTrackingGetAll, timeTrackingUpdate, timeTrackingDelete } from '../../nodes/Plane/resources/timeTracking';
import { createMockExecuteFunctions } from '../helpers/mockExecuteFunctions';

const BASE = '/api/v1/workspaces/test-workspace/projects/p1/work-items/wi1/worklogs';

describe('TimeTracking', () => {
	describe('create', () => {
		it('should POST with required fields', async () => {
			const { ctx, requestCalls } = createMockExecuteFunctions({
				nodeParameters: { projectId: 'p1', workItemId: 'wi1', description: 'Coding', duration: 3600 },
				httpResponse: { id: 'wl1', description: 'Coding', duration: 3600 },
			});

			const result = await timeTrackingCreate.call(ctx);

			expect(requestCalls[0].method).toBe('POST');
			expect(requestCalls[0].url).toBe(`${BASE}/`);
			expect(requestCalls[0].body).toEqual({ description: 'Coding', duration: 3600 });
			expect(result[0].json.id).toBe('wl1');
		});
	});

	describe('getAll', () => {
		it('should GET all worklogs', async () => {
			const { ctx, requestCalls } = createMockExecuteFunctions({
				nodeParameters: { projectId: 'p1', workItemId: 'wi1', returnAll: false, limit: 50 },
				httpResponse: [{ id: 'wl1' }],
			});

			const result = await timeTrackingGetAll.call(ctx);

			expect(requestCalls[0].method).toBe('GET');
			expect(requestCalls[0].url).toBe(`${BASE}/`);
			expect(result).toHaveLength(1);
		});
	});

	describe('update', () => {
		it('should PATCH with update fields', async () => {
			const { ctx, requestCalls } = createMockExecuteFunctions({
				nodeParameters: { projectId: 'p1', workItemId: 'wi1', worklogId: 'wl1', updateFields: { description: 'Review' } },
				httpResponse: { id: 'wl1', description: 'Review' },
			});

			const result = await timeTrackingUpdate.call(ctx);

			expect(requestCalls[0].method).toBe('PATCH');
			expect(requestCalls[0].url).toBe(`${BASE}/wl1/`);
			expect(result[0].json.description).toBe('Review');
		});
	});

	describe('delete', () => {
		it('should DELETE by worklog ID', async () => {
			const { ctx, requestCalls } = createMockExecuteFunctions({
				nodeParameters: { projectId: 'p1', workItemId: 'wi1', worklogId: 'wl1' },
				httpResponse: undefined,
			});

			const result = await timeTrackingDelete.call(ctx);

			expect(requestCalls[0].method).toBe('DELETE');
			expect(requestCalls[0].url).toBe(`${BASE}/wl1/`);
			expect(result[0].json).toEqual({ success: true });
		});
	});
});
