import { describe, it, expect, afterAll } from 'bun:test';
import {
	createIntegrationExecuteFunctions,
	shouldSkipIntegrationTests,
} from './helpers/integrationExecuteFunctions';
import {
	projectCreate,
	projectGet,
	projectGetAll,
	projectUpdate,
	projectDelete,
} from '../../nodes/Plane/resources/project';

describe.skipIf(shouldSkipIntegrationTests())('Integration: Project', () => {
	let createdProjectId: string | undefined;

	afterAll(async () => {
		if (createdProjectId) {
			try {
				const ctx = createIntegrationExecuteFunctions({ projectId: createdProjectId });
				await projectDelete.call(ctx);
			} catch (e) {
				console.warn(`Cleanup: failed to delete project ${createdProjectId}:`, e);
			}
		}
	});

	it('should create a project', async () => {
		const suffix = Date.now().toString(36).toUpperCase().slice(-4);
		const identifier = `IT${suffix}`.slice(0, 5);

		const ctx = createIntegrationExecuteFunctions({
			name: `Integration Test ${suffix}`,
			identifier,
			additionalFields: { description: 'Created by integration test', network: 2 },
		});

		const result = await projectCreate.call(ctx);

		expect(result).toHaveLength(1);
		expect(result[0].json.id).toBeDefined();
		expect(result[0].json.name).toContain('Integration Test');
		expect(result[0].json.identifier).toBe(identifier);

		createdProjectId = result[0].json.id as string;
	});

	it('should get the created project', async () => {
		expect(createdProjectId).toBeDefined();

		const ctx = createIntegrationExecuteFunctions({ projectId: createdProjectId });
		const result = await projectGet.call(ctx);

		expect(result).toHaveLength(1);
		expect(result[0].json.id).toBe(createdProjectId);
	});

	it('should update the project', async () => {
		expect(createdProjectId).toBeDefined();

		const ctx = createIntegrationExecuteFunctions({
			projectId: createdProjectId,
			updateFields: { description: 'Updated by integration test' },
		});

		const result = await projectUpdate.call(ctx);

		expect(result).toHaveLength(1);
		expect(result[0].json.description).toBe('Updated by integration test');
	});

	it('should list projects (getAll)', async () => {
		expect(createdProjectId).toBeDefined();

		const ctx = createIntegrationExecuteFunctions({ returnAll: false, limit: 100 });
		const result = await projectGetAll.call(ctx);

		expect(result.length).toBeGreaterThanOrEqual(1);
		const found = result.find((r) => r.json.id === createdProjectId);
		expect(found).toBeDefined();
	});

	it('should delete the project', async () => {
		expect(createdProjectId).toBeDefined();

		const ctx = createIntegrationExecuteFunctions({ projectId: createdProjectId });
		const result = await projectDelete.call(ctx);

		expect(result).toHaveLength(1);
		expect(result[0].json.success).toBe(true);

		createdProjectId = undefined; // cleaned up, skip afterAll
	});
});
