import { describe, it, expect } from 'bun:test';
import { epicGet, epicGetAll } from '../../nodes/Plane/resources/epic';
import { createMockExecuteFunctions } from '../helpers/mockExecuteFunctions';

const BASE = '/api/v1/workspaces/test-workspace/projects/p1/epics';

describe('Epic', () => {
	describe('get', () => {
		it('should GET by epic ID', async () => {
			const { ctx, requestCalls } = createMockExecuteFunctions({
				nodeParameters: { projectId: 'p1', epicId: 'e1' },
				httpResponse: { id: 'e1', name: 'Big Feature' },
			});

			const result = await epicGet.call(ctx);

			expect(requestCalls[0].method).toBe('GET');
			expect(requestCalls[0].url).toBe(`${BASE}/e1/`);
			expect(result[0].json.id).toBe('e1');
		});
	});

	describe('getAll', () => {
		it('should GET all epics', async () => {
			const { ctx, requestCalls } = createMockExecuteFunctions({
				nodeParameters: { projectId: 'p1', returnAll: false, limit: 50 },
				httpResponse: [{ id: 'e1' }],
			});

			const result = await epicGetAll.call(ctx);

			expect(requestCalls[0].method).toBe('GET');
			expect(requestCalls[0].url).toBe(`${BASE}/`);
			expect(result).toHaveLength(1);
		});
	});
});
