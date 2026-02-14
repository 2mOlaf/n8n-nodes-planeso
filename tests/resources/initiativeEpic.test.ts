import { describe, it, expect } from 'bun:test';
import { initiativeEpicAdd, initiativeEpicGetAll, initiativeEpicRemove } from '../../nodes/Plane/resources/initiativeEpic';
import { createMockExecuteFunctions } from '../helpers/mockExecuteFunctions';

const BASE = '/api/v1/workspaces/test-workspace/initiatives/init1/epics';

describe('InitiativeEpic', () => {
	describe('add', () => {
		it('should POST epic IDs to initiative', async () => {
			const { ctx, requestCalls } = createMockExecuteFunctions({
				nodeParameters: { initiativeId: 'init1', epic_ids: 'e1,e2' },
				httpResponse: [{ id: 'e1' }, { id: 'e2' }],
			});

			const result = await initiativeEpicAdd.call(ctx);

			expect(requestCalls[0].method).toBe('POST');
			expect(requestCalls[0].url).toBe(`${BASE}/`);
			expect(requestCalls[0].body).toEqual({ epic_ids: ['e1', 'e2'] });
			expect(result).toHaveLength(2);
		});
	});

	describe('getAll', () => {
		it('should GET all epics for initiative', async () => {
			const { ctx, requestCalls } = createMockExecuteFunctions({
				nodeParameters: { initiativeId: 'init1', returnAll: false, limit: 50 },
				httpResponse: [{ id: 'e1' }],
			});

			const result = await initiativeEpicGetAll.call(ctx);

			expect(requestCalls[0].method).toBe('GET');
			expect(requestCalls[0].url).toBe(`${BASE}/`);
			expect(result).toHaveLength(1);
		});
	});

	describe('remove', () => {
		it('should DELETE epic IDs from initiative', async () => {
			const { ctx, requestCalls } = createMockExecuteFunctions({
				nodeParameters: { initiativeId: 'init1', epic_ids: 'e1' },
				httpResponse: undefined,
			});

			const result = await initiativeEpicRemove.call(ctx);

			expect(requestCalls[0].method).toBe('DELETE');
			expect(requestCalls[0].url).toBe(`${BASE}/`);
			expect(requestCalls[0].body).toEqual({ epic_ids: ['e1'] });
			expect(result[0].json).toEqual({ success: true });
		});
	});
});
