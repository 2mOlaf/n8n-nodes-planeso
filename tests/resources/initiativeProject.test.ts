import { describe, it, expect } from 'bun:test';
import { initiativeProjectAdd, initiativeProjectGetAll, initiativeProjectRemove } from '../../nodes/Plane/resources/initiativeProject';
import { createMockExecuteFunctions } from '../helpers/mockExecuteFunctions';

const BASE = '/api/v1/workspaces/test-workspace/initiatives/init1/projects';

describe('InitiativeProject', () => {
	describe('add', () => {
		it('should POST project IDs to initiative', async () => {
			const { ctx, requestCalls } = createMockExecuteFunctions({
				nodeParameters: { initiativeId: 'init1', project_ids: ['p1', 'p2'] },
				httpResponse: [{ id: 'p1' }, { id: 'p2' }],
			});

			const result = await initiativeProjectAdd.call(ctx);

			expect(requestCalls[0].method).toBe('POST');
			expect(requestCalls[0].url).toBe(`${BASE}/`);
			expect(requestCalls[0].body).toEqual({ project_ids: ['p1', 'p2'] });
			expect(result).toHaveLength(2);
		});
	});

	describe('getAll', () => {
		it('should GET all projects for initiative', async () => {
			const { ctx, requestCalls } = createMockExecuteFunctions({
				nodeParameters: { initiativeId: 'init1', returnAll: false, limit: 50 },
				httpResponse: [{ id: 'p1' }],
			});

			const result = await initiativeProjectGetAll.call(ctx);

			expect(requestCalls[0].method).toBe('GET');
			expect(requestCalls[0].url).toBe(`${BASE}/`);
			expect(result).toHaveLength(1);
		});
	});

	describe('remove', () => {
		it('should DELETE project IDs from initiative', async () => {
			const { ctx, requestCalls } = createMockExecuteFunctions({
				nodeParameters: { initiativeId: 'init1', project_ids: ['p1'] },
				httpResponse: undefined,
			});

			const result = await initiativeProjectRemove.call(ctx);

			expect(requestCalls[0].method).toBe('DELETE');
			expect(requestCalls[0].url).toBe(`${BASE}/`);
			expect(requestCalls[0].body).toEqual({ project_ids: ['p1'] });
			expect(result[0].json).toEqual({ success: true });
		});
	});
});
