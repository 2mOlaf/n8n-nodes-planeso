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
	workItemGet,
	workItemGetByIdentifier,
	workItemGetAll,
	workItemSearch,
	workItemUpdate,
	workItemDelete,
} from '../../nodes/Plane/resources/workItem';

describe.skipIf(shouldSkipIntegrationTests())('Integration: Work Item', () => {
	const suffix = Date.now().toString(36).toUpperCase().slice(-4);
	let projectId: string | undefined;
	let projectIdentifier: string | undefined;
	let workItemId: string | undefined;
	let workItemSequenceId: number | undefined;

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

	it('setup: create project', async () => {
		const identifier = `WI${suffix}`.slice(0, 5);
		const ctx = createIntegrationExecuteFunctions({
			name: `WI IT Project ${suffix}`,
			identifier,
			additionalFields: { network: 2 },
		});
		const result = await projectCreate.call(ctx);
		projectId = result[0].json.id as string;
		projectIdentifier = result[0].json.identifier as string;
		expect(projectId).toBeDefined();
		expect(projectIdentifier).toBeDefined();
	});

	it('should create a work item', async () => {
		expect(projectId).toBeDefined();
		const ctx = createIntegrationExecuteFunctions({
			projectId,
			name: `IT WorkItem ${suffix}`,
			additionalFields: { priority: 'medium' },
		});
		const result = await workItemCreate.call(ctx);

		expect(result).toHaveLength(1);
		expect(result[0].json.id).toBeDefined();
		workItemId = result[0].json.id as string;
		workItemSequenceId = result[0].json.sequence_id as number;
	});

	it('should get the work item', async () => {
		expect(workItemId).toBeDefined();
		const ctx = createIntegrationExecuteFunctions({ projectId, workItemId });
		const result = await workItemGet.call(ctx);

		expect(result).toHaveLength(1);
		expect(result[0].json.id).toBe(workItemId);
	});

	it('should get work item by identifier', async () => {
		expect(projectIdentifier).toBeDefined();
		expect(workItemSequenceId).toBeDefined();
		const identifier = `${projectIdentifier}-${workItemSequenceId}`;
		const ctx = createIntegrationExecuteFunctions({ identifier });
		const result = await workItemGetByIdentifier.call(ctx);

		expect(result).toHaveLength(1);
		expect(result[0].json.id).toBe(workItemId);
	});

	it('should list work items (getAll)', async () => {
		expect(projectId).toBeDefined();
		const ctx = createIntegrationExecuteFunctions({
			projectId,
			returnAll: false,
			limit: 100,
		});
		const result = await workItemGetAll.call(ctx);

		expect(result.length).toBeGreaterThanOrEqual(1);
		const found = result.find((r) => r.json.id === workItemId);
		expect(found).toBeDefined();
	});

	it('should search for work items', async () => {
		expect(workItemId).toBeDefined();
		const ctx = createIntegrationExecuteFunctions({
			search: `IT WorkItem ${suffix}`,
			returnAll: false,
			limit: 10,
		});
		const result = await workItemSearch.call(ctx);

		expect(Array.isArray(result)).toBe(true);
	});

	it('should update the work item', async () => {
		expect(workItemId).toBeDefined();
		const ctx = createIntegrationExecuteFunctions({
			projectId,
			workItemId,
			updateFields: { name: `Updated WorkItem ${suffix}` },
		});
		const result = await workItemUpdate.call(ctx);

		expect(result).toHaveLength(1);
	});

	it('should delete the work item', async () => {
		expect(workItemId).toBeDefined();
		const ctx = createIntegrationExecuteFunctions({ projectId, workItemId });
		const result = await workItemDelete.call(ctx);

		expect(result).toHaveLength(1);
		expect(result[0].json.success).toBe(true);
		workItemId = undefined;
	});
});
