import { describe, it, expect, afterAll } from 'bun:test';
import {
	createIntegrationExecuteFunctions,
	shouldSkipIntegrationTests,
} from './helpers/integrationExecuteFunctions';
import {
	projectCreate,
	projectDelete,
} from '../../nodes/Plane/resources/project';
import {
	workItemCreate,
	workItemDelete,
} from '../../nodes/Plane/resources/workItem';
import {
	workItemCommentCreate,
	workItemCommentGet,
	workItemCommentGetAll,
	workItemCommentUpdate,
	workItemCommentDelete,
} from '../../nodes/Plane/resources/workItemComment';
import {
	workItemLinkCreate,
	workItemLinkGet,
	workItemLinkGetAll,
	workItemLinkUpdate,
	workItemLinkDelete,
} from '../../nodes/Plane/resources/workItemLink';
import {
	timeTrackingCreate,
	timeTrackingGetAll,
	timeTrackingUpdate,
	timeTrackingDelete,
} from '../../nodes/Plane/resources/timeTracking';
import {
	workItemActivityGet,
	workItemActivityGetAll,
} from '../../nodes/Plane/resources/workItemActivity';
import {
	workItemAttachmentGetAll,
} from '../../nodes/Plane/resources/workItemAttachment';

describe.skipIf(shouldSkipIntegrationTests())('Integration: Work Item Children', () => {
	const suffix = Date.now().toString(36).toUpperCase().slice(-4);
	let projectId: string | undefined;
	let workItemId: string | undefined;

	afterAll(async () => {
		if (workItemId && projectId) {
			try {
				const ctx = createIntegrationExecuteFunctions({ projectId, workItemId });
				await workItemDelete.call(ctx);
			} catch (e) {
				console.warn(`Cleanup: failed to delete work item ${workItemId}:`, e);
			}
		}
		if (projectId) {
			try {
				const ctx = createIntegrationExecuteFunctions({ projectId });
				await projectDelete.call(ctx);
			} catch (e) {
				console.warn(`Cleanup: failed to delete project ${projectId}:`, e);
			}
		}
	});

	it('setup: create project and work item', async () => {
		const identifier = `WC${suffix}`.slice(0, 5);
		const projCtx = createIntegrationExecuteFunctions({
			name: `WC IT Project ${suffix}`,
			identifier,
			additionalFields: { network: 2 },
		});
		const projResult = await projectCreate.call(projCtx);
		projectId = projResult[0].json.id as string;

		const wiCtx = createIntegrationExecuteFunctions({
			projectId,
			name: `WC IT WorkItem ${suffix}`,
			additionalFields: {},
		});
		const wiResult = await workItemCreate.call(wiCtx);
		workItemId = wiResult[0].json.id as string;

		expect(projectId).toBeDefined();
		expect(workItemId).toBeDefined();
	});

	describe('Work Item Comment', () => {
		let commentId: string | undefined;

		afterAll(async () => {
			if (commentId && projectId && workItemId) {
				try {
					const ctx = createIntegrationExecuteFunctions({ projectId, workItemId, commentId });
					await workItemCommentDelete.call(ctx);
				} catch (e) {
					console.warn(`Cleanup: failed to delete comment ${commentId}:`, e);
				}
			}
		});

		it('should create a comment', async () => {
			expect(projectId).toBeDefined();
			expect(workItemId).toBeDefined();
			const ctx = createIntegrationExecuteFunctions({
				projectId,
				workItemId,
				comment_html: '<p>Integration test comment</p>',
			});
			const result = await workItemCommentCreate.call(ctx);

			expect(result).toHaveLength(1);
			expect(result[0].json.id).toBeDefined();
			commentId = result[0].json.id as string;
		});

		it('should get the comment', async () => {
			expect(commentId).toBeDefined();
			const ctx = createIntegrationExecuteFunctions({ projectId, workItemId, commentId });
			const result = await workItemCommentGet.call(ctx);

			expect(result).toHaveLength(1);
			expect(result[0].json.id).toBe(commentId);
		});

		it('should list comments (getAll)', async () => {
			expect(commentId).toBeDefined();
			const ctx = createIntegrationExecuteFunctions({
				projectId,
				workItemId,
				returnAll: false,
				limit: 100,
			});
			const result = await workItemCommentGetAll.call(ctx);

			expect(result.length).toBeGreaterThanOrEqual(1);
			const found = result.find((r) => r.json.id === commentId);
			expect(found).toBeDefined();
		});

		it('should update the comment', async () => {
			expect(commentId).toBeDefined();
			const ctx = createIntegrationExecuteFunctions({
				projectId,
				workItemId,
				commentId,
				updateFields: { comment_html: '<p>Updated by integration test</p>' },
			});
			const result = await workItemCommentUpdate.call(ctx);

			expect(result).toHaveLength(1);
		});

		it('should delete the comment', async () => {
			expect(commentId).toBeDefined();
			const ctx = createIntegrationExecuteFunctions({ projectId, workItemId, commentId });
			const result = await workItemCommentDelete.call(ctx);

			expect(result).toHaveLength(1);
			expect(result[0].json.success).toBe(true);
			commentId = undefined;
		});
	});

	describe('Work Item Link', () => {
		let linkId: string | undefined;

		afterAll(async () => {
			if (linkId && projectId && workItemId) {
				try {
					const ctx = createIntegrationExecuteFunctions({ projectId, workItemId, linkId });
					await workItemLinkDelete.call(ctx);
				} catch (e) {
					console.warn(`Cleanup: failed to delete link ${linkId}:`, e);
				}
			}
		});

		it('should create a link', async () => {
			expect(projectId).toBeDefined();
			expect(workItemId).toBeDefined();
			const ctx = createIntegrationExecuteFunctions({
				projectId,
				workItemId,
				url: 'https://example.com/integration-test',
				additionalFields: { title: `IT Link ${suffix}` },
			});
			const result = await workItemLinkCreate.call(ctx);

			expect(result).toHaveLength(1);
			expect(result[0].json.id).toBeDefined();
			linkId = result[0].json.id as string;
		});

		it('should get the link', async () => {
			expect(linkId).toBeDefined();
			const ctx = createIntegrationExecuteFunctions({ projectId, workItemId, linkId });
			const result = await workItemLinkGet.call(ctx);

			expect(result).toHaveLength(1);
			expect(result[0].json.id).toBe(linkId);
		});

		it('should list links (getAll)', async () => {
			expect(linkId).toBeDefined();
			const ctx = createIntegrationExecuteFunctions({
				projectId,
				workItemId,
				returnAll: false,
				limit: 100,
			});
			const result = await workItemLinkGetAll.call(ctx);

			expect(result.length).toBeGreaterThanOrEqual(1);
			const found = result.find((r) => r.json.id === linkId);
			expect(found).toBeDefined();
		});

		it('should update the link', async () => {
			expect(linkId).toBeDefined();
			const ctx = createIntegrationExecuteFunctions({
				projectId,
				workItemId,
				linkId,
				updateFields: { title: `Updated Link ${suffix}` },
			});
			const result = await workItemLinkUpdate.call(ctx);

			expect(result).toHaveLength(1);
		});

		it('should delete the link', async () => {
			expect(linkId).toBeDefined();
			const ctx = createIntegrationExecuteFunctions({ projectId, workItemId, linkId });
			const result = await workItemLinkDelete.call(ctx);

			expect(result).toHaveLength(1);
			expect(result[0].json.success).toBe(true);
			linkId = undefined;
		});
	});

	describe('Time Tracking', () => {
		let worklogId: string | undefined;
		let featureDisabled = false;

		afterAll(async () => {
			if (worklogId && projectId && workItemId) {
				try {
					const ctx = createIntegrationExecuteFunctions({ projectId, workItemId, worklogId });
					await timeTrackingDelete.call(ctx);
				} catch (e) {
					console.warn(`Cleanup: failed to delete worklog ${worklogId}:`, e);
				}
			}
		});

		it('should create a worklog entry', async () => {
			expect(projectId).toBeDefined();
			expect(workItemId).toBeDefined();
			const ctx = createIntegrationExecuteFunctions({
				projectId,
				workItemId,
				description: 'Integration test worklog',
				duration: 30,
			});
			try {
				const result = await timeTrackingCreate.call(ctx);
				expect(result).toHaveLength(1);
				expect(result[0].json.id).toBeDefined();
				worklogId = result[0].json.id as string;
			} catch (e: unknown) {
				if (e instanceof Error && e.message.includes('not enabled')) {
					featureDisabled = true;
					console.warn('Time tracking not enabled for project, skipping tests');
					return;
				}
				throw e;
			}
		});

		it('should list worklog entries (getAll)', async () => {
			if (featureDisabled) return;
			expect(worklogId).toBeDefined();
			const ctx = createIntegrationExecuteFunctions({
				projectId,
				workItemId,
				returnAll: false,
				limit: 100,
			});
			const result = await timeTrackingGetAll.call(ctx);

			expect(result.length).toBeGreaterThanOrEqual(1);
			const found = result.find((r) => r.json.id === worklogId);
			expect(found).toBeDefined();
		});

		it('should update the worklog entry', async () => {
			if (featureDisabled) return;
			expect(worklogId).toBeDefined();
			const ctx = createIntegrationExecuteFunctions({
				projectId,
				workItemId,
				worklogId,
				updateFields: { description: 'Updated by integration test' },
			});
			const result = await timeTrackingUpdate.call(ctx);

			expect(result).toHaveLength(1);
		});

		it('should delete the worklog entry', async () => {
			if (featureDisabled) return;
			expect(worklogId).toBeDefined();
			const ctx = createIntegrationExecuteFunctions({ projectId, workItemId, worklogId });
			const result = await timeTrackingDelete.call(ctx);

			expect(result).toHaveLength(1);
			expect(result[0].json.success).toBe(true);
			worklogId = undefined;
		});
	});

	describe('Work Item Activity (read-only)', () => {
		let activityId: string | undefined;
		let featureUnavailable = false;

		it('should list activities (getAll)', async () => {
			expect(projectId).toBeDefined();
			expect(workItemId).toBeDefined();
			const ctx = createIntegrationExecuteFunctions({
				projectId,
				workItemId,
				returnAll: false,
				limit: 10,
			});
			try {
				const result = await workItemActivityGetAll.call(ctx);
				expect(Array.isArray(result)).toBe(true);
				if (result.length > 0) {
					activityId = result[0].json.id as string;
				}
			} catch (e: unknown) {
				if (e instanceof Error && (e.message.includes('404') || e.message.includes('not found'))) {
					featureUnavailable = true;
					console.warn('Work item activity endpoint unavailable, skipping tests');
					return;
				}
				throw e;
			}
		});

		it('should get an activity (if any exist)', async () => {
			if (featureUnavailable || !activityId) return;

			const ctx = createIntegrationExecuteFunctions({
				projectId,
				workItemId,
				activityId,
			});
			const result = await workItemActivityGet.call(ctx);

			expect(result).toHaveLength(1);
			expect(result[0].json.id).toBe(activityId);
		});
	});

	describe('Work Item Attachment (read-only)', () => {
		it('should list attachments (getAll)', async () => {
			expect(projectId).toBeDefined();
			expect(workItemId).toBeDefined();
			const ctx = createIntegrationExecuteFunctions({
				projectId,
				workItemId,
				returnAll: false,
				limit: 10,
			});
			const result = await workItemAttachmentGetAll.call(ctx);

			expect(Array.isArray(result)).toBe(true);
		});
	});
});
