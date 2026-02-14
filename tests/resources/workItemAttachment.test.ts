import { describe, it, expect } from 'bun:test';
import {
	workItemAttachmentGet,
	workItemAttachmentGetAll,
	workItemAttachmentDelete,
} from '../../nodes/Plane/resources/workItemAttachment';
import { createMockExecuteFunctions } from '../helpers/mockExecuteFunctions';

const BASE = '/api/v1/workspaces/test-workspace/projects/p1/work-items/wi1/attachments';

describe('WorkItemAttachment', () => {
	describe('get', () => {
		it('should GET by attachment ID', async () => {
			const { ctx, requestCalls } = createMockExecuteFunctions({
				nodeParameters: { projectId: 'p1', workItemId: 'wi1', attachmentId: 'att1' },
				httpResponse: { id: 'att1', name: 'file.pdf' },
			});

			const result = await workItemAttachmentGet.call(ctx);

			expect(requestCalls[0].method).toBe('GET');
			expect(requestCalls[0].url).toBe(`${BASE}/att1/`);
			expect(result[0].json.id).toBe('att1');
		});
	});

	describe('getAll', () => {
		it('should GET all attachments', async () => {
			const { ctx, requestCalls } = createMockExecuteFunctions({
				nodeParameters: { projectId: 'p1', workItemId: 'wi1', returnAll: false, limit: 50 },
				httpResponse: [{ id: 'att1' }],
			});

			const result = await workItemAttachmentGetAll.call(ctx);

			expect(requestCalls[0].method).toBe('GET');
			expect(requestCalls[0].url).toBe(`${BASE}/`);
			expect(result).toHaveLength(1);
		});
	});

	describe('delete', () => {
		it('should DELETE by attachment ID', async () => {
			const { ctx, requestCalls } = createMockExecuteFunctions({
				nodeParameters: { projectId: 'p1', workItemId: 'wi1', attachmentId: 'att1' },
				httpResponse: '',
			});

			const result = await workItemAttachmentDelete.call(ctx);

			expect(requestCalls[0].method).toBe('DELETE');
			expect(requestCalls[0].url).toBe(`${BASE}/att1/`);
			expect(result).toHaveLength(1);
		});
	});
});
