import { describe, it, expect } from 'bun:test';
import { workItemActivityGet, workItemActivityGetAll } from '../../nodes/Plane/resources/workItemActivity';
import { createMockExecuteFunctions } from '../helpers/mockExecuteFunctions';

const BASE = '/api/v1/workspaces/test-workspace/projects/p1/work-items/wi1/activity';

describe('WorkItemActivity', () => {
	describe('get', () => {
		it('should GET by activity ID', async () => {
			const { ctx, requestCalls } = createMockExecuteFunctions({
				nodeParameters: { projectId: 'p1', workItemId: 'wi1', activityId: 'act1' },
				httpResponse: { id: 'act1', field: 'state' },
			});

			const result = await workItemActivityGet.call(ctx);

			expect(requestCalls[0].method).toBe('GET');
			expect(requestCalls[0].url).toBe(`${BASE}/act1/`);
			expect(result[0].json.id).toBe('act1');
		});
	});

	describe('getAll', () => {
		it('should GET all activities', async () => {
			const { ctx, requestCalls } = createMockExecuteFunctions({
				nodeParameters: { projectId: 'p1', workItemId: 'wi1', returnAll: false, limit: 50 },
				httpResponse: [{ id: 'act1' }, { id: 'act2' }],
			});

			const result = await workItemActivityGetAll.call(ctx);

			expect(requestCalls[0].method).toBe('GET');
			expect(requestCalls[0].url).toBe(`${BASE}/`);
			expect(result).toHaveLength(2);
		});
	});
});
