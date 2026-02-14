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
	pageCreate,
	pageGet,
} from '../../nodes/Plane/resources/page';

describe.skipIf(shouldSkipIntegrationTests())('Integration: Page', () => {
	const suffix = Date.now().toString(36).toUpperCase().slice(-4);
	let projectId: string | undefined;
	let workspacePageId: string | undefined;
	let projectPageId: string | undefined;

	afterAll(async () => {
		// Pages cannot be deleted via API — only clean up the project
		if (projectId) {
			try {
				const ctx = createIntegrationExecuteFunctions({ projectId });
				await projectDelete.call(ctx);
			} catch (e) {
				console.warn(`Cleanup: failed to delete project ${projectId}:`, e);
			}
		}
	});

	it('setup: create project', async () => {
		const identifier = `PG${suffix}`.slice(0, 5);
		const ctx = createIntegrationExecuteFunctions({
			name: `PG IT Project ${suffix}`,
			identifier,
			additionalFields: { network: 2 },
		});
		const result = await projectCreate.call(ctx);
		projectId = result[0].json.id as string;
		expect(projectId).toBeDefined();
	});

	it('should create a workspace-scoped page', async () => {
		const ctx = createIntegrationExecuteFunctions({
			scope: 'workspace',
			name: `IT Page WS ${suffix}`,
			additionalFields: { description_html: '<p>Integration test workspace page</p>' },
		});
		const result = await pageCreate.call(ctx);

		expect(result).toHaveLength(1);
		expect(result[0].json.id).toBeDefined();
		workspacePageId = result[0].json.id as string;
	});

	it('should get the workspace-scoped page', async () => {
		expect(workspacePageId).toBeDefined();
		const ctx = createIntegrationExecuteFunctions({
			scope: 'workspace',
			pageId: workspacePageId,
		});
		const result = await pageGet.call(ctx);

		expect(result).toHaveLength(1);
		expect(result[0].json.id).toBe(workspacePageId);
	});

	it('should create a project-scoped page', async () => {
		expect(projectId).toBeDefined();
		const ctx = createIntegrationExecuteFunctions({
			scope: 'project',
			projectId,
			name: `IT Page Proj ${suffix}`,
			additionalFields: { description_html: '<p>Integration test project page</p>' },
		});
		const result = await pageCreate.call(ctx);

		expect(result).toHaveLength(1);
		expect(result[0].json.id).toBeDefined();
		projectPageId = result[0].json.id as string;
	});

	it('should get the project-scoped page', async () => {
		expect(projectPageId).toBeDefined();
		const ctx = createIntegrationExecuteFunctions({
			scope: 'project',
			projectId,
			pageId: projectPageId,
		});
		const result = await pageGet.call(ctx);

		expect(result).toHaveLength(1);
		expect(result[0].json.id).toBe(projectPageId);
	});
});
