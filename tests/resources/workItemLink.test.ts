import { describe, it, expect } from 'bun:test';
import {
	workItemLinkCreate,
	workItemLinkGet,
	workItemLinkGetAll,
	workItemLinkUpdate,
	workItemLinkDelete,
} from '../../nodes/Plane/resources/workItemLink';
import { createMockExecuteFunctions } from '../helpers/mockExecuteFunctions';

const BASE = '/api/v1/workspaces/test-workspace/projects/p1/work-items/wi1/links';

describe('WorkItemLink', () => {
	describe('create', () => {
		it('should POST with required fields', async () => {
			const { ctx, requestCalls } = createMockExecuteFunctions({
				nodeParameters: { projectId: 'p1', workItemId: 'wi1', url: 'https://example.com', additionalFields: {} },
				httpResponse: { id: 'link1', url: 'https://example.com' },
			});

			const result = await workItemLinkCreate.call(ctx);

			expect(requestCalls[0].method).toBe('POST');
			expect(requestCalls[0].url).toBe(`${BASE}/`);
			expect(requestCalls[0].body).toEqual({ url: 'https://example.com' });
			expect(result[0].json.id).toBe('link1');
		});

		it('should include title when provided', async () => {
			const { ctx, requestCalls } = createMockExecuteFunctions({
				nodeParameters: { projectId: 'p1', workItemId: 'wi1', url: 'https://example.com', additionalFields: { title: 'My Link' } },
				httpResponse: { id: 'link1' },
			});

			await workItemLinkCreate.call(ctx);

			expect(requestCalls[0].body).toEqual({ url: 'https://example.com', title: 'My Link' });
		});
	});

	describe('get', () => {
		it('should GET by link ID', async () => {
			const { ctx, requestCalls } = createMockExecuteFunctions({
				nodeParameters: { projectId: 'p1', workItemId: 'wi1', linkId: 'link1' },
				httpResponse: { id: 'link1' },
			});

			const result = await workItemLinkGet.call(ctx);

			expect(requestCalls[0].method).toBe('GET');
			expect(requestCalls[0].url).toBe(`${BASE}/link1/`);
			expect(result[0].json.id).toBe('link1');
		});
	});

	describe('getAll', () => {
		it('should GET all links', async () => {
			const { ctx, requestCalls } = createMockExecuteFunctions({
				nodeParameters: { projectId: 'p1', workItemId: 'wi1', returnAll: false, limit: 50 },
				httpResponse: [{ id: 'link1' }],
			});

			const result = await workItemLinkGetAll.call(ctx);

			expect(requestCalls[0].method).toBe('GET');
			expect(requestCalls[0].url).toBe(`${BASE}/`);
			expect(result).toHaveLength(1);
		});
	});

	describe('update', () => {
		it('should PATCH with update fields', async () => {
			const { ctx, requestCalls } = createMockExecuteFunctions({
				nodeParameters: { projectId: 'p1', workItemId: 'wi1', linkId: 'link1', updateFields: { title: 'New Title' } },
				httpResponse: { id: 'link1', title: 'New Title' },
			});

			const result = await workItemLinkUpdate.call(ctx);

			expect(requestCalls[0].method).toBe('PATCH');
			expect(requestCalls[0].url).toBe(`${BASE}/link1/`);
			expect(result[0].json.title).toBe('New Title');
		});
	});

	describe('delete', () => {
		it('should DELETE by link ID', async () => {
			const { ctx, requestCalls } = createMockExecuteFunctions({
				nodeParameters: { projectId: 'p1', workItemId: 'wi1', linkId: 'link1' },
				httpResponse: '',
			});

			const result = await workItemLinkDelete.call(ctx);

			expect(requestCalls[0].method).toBe('DELETE');
			expect(requestCalls[0].url).toBe(`${BASE}/link1/`);
			expect(result).toHaveLength(1);
		});
	});
});
