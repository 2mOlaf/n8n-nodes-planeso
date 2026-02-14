import { describe, it, expect } from 'bun:test';
import {
	workItemCommentCreate,
	workItemCommentGet,
	workItemCommentGetAll,
	workItemCommentUpdate,
	workItemCommentDelete,
} from '../../nodes/Plane/resources/workItemComment';
import { createMockExecuteFunctions } from '../helpers/mockExecuteFunctions';

const BASE = '/api/v1/workspaces/test-workspace/projects/p1/work-items/wi1/comments';

describe('WorkItemComment', () => {
	describe('create', () => {
		it('should POST with comment_html', async () => {
			const { ctx, requestCalls } = createMockExecuteFunctions({
				nodeParameters: { projectId: 'p1', workItemId: 'wi1', comment_html: '<p>Hello</p>' },
				httpResponse: { id: 'c1', comment_html: '<p>Hello</p>' },
			});

			const result = await workItemCommentCreate.call(ctx);

			expect(requestCalls[0].method).toBe('POST');
			expect(requestCalls[0].url).toBe(`${BASE}/`);
			expect(requestCalls[0].body).toEqual({ comment_html: '<p>Hello</p>' });
			expect(result[0].json.id).toBe('c1');
		});
	});

	describe('get', () => {
		it('should GET by comment ID', async () => {
			const { ctx, requestCalls } = createMockExecuteFunctions({
				nodeParameters: { projectId: 'p1', workItemId: 'wi1', commentId: 'c1' },
				httpResponse: { id: 'c1' },
			});

			const result = await workItemCommentGet.call(ctx);

			expect(requestCalls[0].method).toBe('GET');
			expect(requestCalls[0].url).toBe(`${BASE}/c1/`);
			expect(result[0].json.id).toBe('c1');
		});
	});

	describe('getAll', () => {
		it('should GET all comments', async () => {
			const { ctx, requestCalls } = createMockExecuteFunctions({
				nodeParameters: { projectId: 'p1', workItemId: 'wi1', returnAll: false, limit: 50 },
				httpResponse: [{ id: 'c1' }],
			});

			const result = await workItemCommentGetAll.call(ctx);

			expect(requestCalls[0].method).toBe('GET');
			expect(requestCalls[0].url).toBe(`${BASE}/`);
			expect(result).toHaveLength(1);
		});
	});

	describe('update', () => {
		it('should PATCH with update fields', async () => {
			const { ctx, requestCalls } = createMockExecuteFunctions({
				nodeParameters: { projectId: 'p1', workItemId: 'wi1', commentId: 'c1', updateFields: { comment_html: '<p>Updated</p>' } },
				httpResponse: { id: 'c1', comment_html: '<p>Updated</p>' },
			});

			const result = await workItemCommentUpdate.call(ctx);

			expect(requestCalls[0].method).toBe('PATCH');
			expect(requestCalls[0].url).toBe(`${BASE}/c1/`);
			expect(result[0].json.comment_html).toBe('<p>Updated</p>');
		});
	});

	describe('delete', () => {
		it('should DELETE by comment ID', async () => {
			const { ctx, requestCalls } = createMockExecuteFunctions({
				nodeParameters: { projectId: 'p1', workItemId: 'wi1', commentId: 'c1' },
				httpResponse: '',
			});

			const result = await workItemCommentDelete.call(ctx);

			expect(requestCalls[0].method).toBe('DELETE');
			expect(requestCalls[0].url).toBe(`${BASE}/c1/`);
			expect(result).toHaveLength(1);
		});
	});
});
