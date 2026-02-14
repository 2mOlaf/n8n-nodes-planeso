import { describe, it, expect } from 'bun:test';
import { teamspaceProjectAdd, teamspaceProjectGetAll, teamspaceProjectRemove } from '../../nodes/Plane/resources/teamspaceProject';
import { createMockExecuteFunctions } from '../helpers/mockExecuteFunctions';

const BASE = '/api/v1/workspaces/test-workspace/teamspaces/ts1/projects';

describe('TeamspaceProject', () => {
	describe('add', () => {
		it('should POST project IDs to teamspace', async () => {
			const { ctx, requestCalls } = createMockExecuteFunctions({
				nodeParameters: { teamspaceId: 'ts1', project_ids: ['p1', 'p2'] },
				httpResponse: [{ id: 'p1' }, { id: 'p2' }],
			});

			const result = await teamspaceProjectAdd.call(ctx);

			expect(requestCalls[0].method).toBe('POST');
			expect(requestCalls[0].url).toBe(`${BASE}/`);
			expect(requestCalls[0].body).toEqual({ project_ids: ['p1', 'p2'] });
			expect(result).toHaveLength(2);
		});
	});

	describe('getAll', () => {
		it('should GET all teamspace projects', async () => {
			const { ctx, requestCalls } = createMockExecuteFunctions({
				nodeParameters: { teamspaceId: 'ts1', returnAll: false, limit: 50 },
				httpResponse: [{ id: 'p1' }],
			});

			const result = await teamspaceProjectGetAll.call(ctx);

			expect(requestCalls[0].method).toBe('GET');
			expect(requestCalls[0].url).toBe(`${BASE}/`);
			expect(result).toHaveLength(1);
		});
	});

	describe('remove', () => {
		it('should DELETE project IDs from teamspace', async () => {
			const { ctx, requestCalls } = createMockExecuteFunctions({
				nodeParameters: { teamspaceId: 'ts1', project_ids: ['p1'] },
				httpResponse: undefined,
			});

			const result = await teamspaceProjectRemove.call(ctx);

			expect(requestCalls[0].method).toBe('DELETE');
			expect(requestCalls[0].url).toBe(`${BASE}/`);
			expect(requestCalls[0].body).toEqual({ project_ids: ['p1'] });
			expect(result[0].json).toEqual({ success: true });
		});
	});
});
