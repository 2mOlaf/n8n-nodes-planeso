import { describe, it, expect } from 'bun:test';
import { teamspaceMemberAdd, teamspaceMemberGetAll, teamspaceMemberRemove } from '../../nodes/Plane/resources/teamspaceMember';
import { createMockExecuteFunctions } from '../helpers/mockExecuteFunctions';

const BASE = '/api/v1/workspaces/test-workspace/teamspaces/ts1/members';

describe('TeamspaceMember', () => {
	describe('add', () => {
		it('should POST member IDs to teamspace', async () => {
			const { ctx, requestCalls } = createMockExecuteFunctions({
				nodeParameters: { teamspaceId: 'ts1', member_ids: 'u1,u2' },
				httpResponse: [{ id: 'u1' }, { id: 'u2' }],
			});

			const result = await teamspaceMemberAdd.call(ctx);

			expect(requestCalls[0].method).toBe('POST');
			expect(requestCalls[0].url).toBe(`${BASE}/`);
			expect(requestCalls[0].body).toEqual({ member_ids: ['u1', 'u2'] });
			expect(result).toHaveLength(2);
		});
	});

	describe('getAll', () => {
		it('should GET all teamspace members', async () => {
			const { ctx, requestCalls } = createMockExecuteFunctions({
				nodeParameters: { teamspaceId: 'ts1', returnAll: false, limit: 50 },
				httpResponse: [{ id: 'u1' }],
			});

			const result = await teamspaceMemberGetAll.call(ctx);

			expect(requestCalls[0].method).toBe('GET');
			expect(requestCalls[0].url).toBe(`${BASE}/`);
			expect(result).toHaveLength(1);
		});
	});

	describe('remove', () => {
		it('should DELETE member IDs from teamspace', async () => {
			const { ctx, requestCalls } = createMockExecuteFunctions({
				nodeParameters: { teamspaceId: 'ts1', member_ids: 'u1' },
				httpResponse: undefined,
			});

			const result = await teamspaceMemberRemove.call(ctx);

			expect(requestCalls[0].method).toBe('DELETE');
			expect(requestCalls[0].url).toBe(`${BASE}/`);
			expect(requestCalls[0].body).toEqual({ member_ids: ['u1'] });
			expect(result[0].json).toEqual({ success: true });
		});
	});
});
