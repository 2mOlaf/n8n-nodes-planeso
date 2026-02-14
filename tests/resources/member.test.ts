import { describe, it, expect } from 'bun:test';
import { memberGetAll } from '../../nodes/Plane/resources/member';
import { createMockExecuteFunctions } from '../helpers/mockExecuteFunctions';

describe('Member', () => {
	describe('getAll', () => {
		it('should list workspace members', async () => {
			const members = [{ id: 'm1' }, { id: 'm2' }];
			const { ctx, requestCalls } = createMockExecuteFunctions({
				nodeParameters: { scope: 'workspace', returnAll: false, limit: 50 },
				httpResponse: members,
			});

			const result = await memberGetAll.call(ctx);

			expect(requestCalls).toHaveLength(1);
			expect(requestCalls[0].method).toBe('GET');
			expect(requestCalls[0].url).toBe('/api/v1/workspaces/test-workspace/members/');
			expect(result).toHaveLength(2);
		});

		it('should list project members when scope is project', async () => {
			const members = [{ id: 'm1' }];
			const { ctx, requestCalls } = createMockExecuteFunctions({
				nodeParameters: { scope: 'project', projectId: 'p1', returnAll: false, limit: 50 },
				httpResponse: members,
			});

			const result = await memberGetAll.call(ctx);

			expect(requestCalls).toHaveLength(1);
			expect(requestCalls[0].url).toBe('/api/v1/workspaces/test-workspace/projects/p1/members/');
			expect(result).toHaveLength(1);
		});
	});
});
