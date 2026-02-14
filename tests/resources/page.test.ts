import { describe, it, expect } from 'bun:test';
import { pageCreate, pageGet } from '../../nodes/Plane/resources/page';
import { createMockExecuteFunctions } from '../helpers/mockExecuteFunctions';

describe('Page', () => {
	describe('create', () => {
		it('should POST workspace-level page', async () => {
			const { ctx, requestCalls } = createMockExecuteFunctions({
				nodeParameters: { scope: 'workspace', name: 'My Page', additionalFields: {} },
				httpResponse: { id: 'pg1', name: 'My Page' },
			});

			const result = await pageCreate.call(ctx);

			expect(requestCalls[0].method).toBe('POST');
			expect(requestCalls[0].url).toBe('/api/v1/workspaces/test-workspace/pages/');
			expect(requestCalls[0].body).toEqual({ name: 'My Page' });
			expect(result[0].json.id).toBe('pg1');
		});

		it('should POST project-level page', async () => {
			const { ctx, requestCalls } = createMockExecuteFunctions({
				nodeParameters: { scope: 'project', projectId: 'p1', name: 'Notes', additionalFields: { description_html: '<p>Notes</p>' } },
				httpResponse: { id: 'pg2' },
			});

			await pageCreate.call(ctx);

			expect(requestCalls[0].url).toBe('/api/v1/workspaces/test-workspace/projects/p1/pages/');
			expect(requestCalls[0].body).toEqual({ name: 'Notes', description_html: '<p>Notes</p>' });
		});
	});

	describe('get', () => {
		it('should GET workspace-level page', async () => {
			const { ctx, requestCalls } = createMockExecuteFunctions({
				nodeParameters: { scope: 'workspace', pageId: 'pg1' },
				httpResponse: { id: 'pg1' },
			});

			const result = await pageGet.call(ctx);

			expect(requestCalls[0].method).toBe('GET');
			expect(requestCalls[0].url).toBe('/api/v1/workspaces/test-workspace/pages/pg1/');
			expect(result[0].json.id).toBe('pg1');
		});

		it('should GET project-level page', async () => {
			const { ctx, requestCalls } = createMockExecuteFunctions({
				nodeParameters: { scope: 'project', projectId: 'p1', pageId: 'pg1' },
				httpResponse: { id: 'pg1' },
			});

			await pageGet.call(ctx);

			expect(requestCalls[0].url).toBe('/api/v1/workspaces/test-workspace/projects/p1/pages/pg1/');
		});
	});
});
