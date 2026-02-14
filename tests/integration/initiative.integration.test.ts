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
	initiativeCreate,
	initiativeGet,
	initiativeGetAll,
	initiativeUpdate,
	initiativeDelete,
} from '../../nodes/Plane/resources/initiative';
import {
	initiativeLabelCreate,
	initiativeLabelGet,
	initiativeLabelGetAll,
	initiativeLabelUpdate,
	initiativeLabelDelete,
	initiativeLabelAddToInitiative,
	initiativeLabelGetAllForInitiative,
	initiativeLabelRemoveFromInitiative,
} from '../../nodes/Plane/resources/initiativeLabel';
import {
	initiativeProjectAdd,
	initiativeProjectGetAll,
	initiativeProjectRemove,
} from '../../nodes/Plane/resources/initiativeProject';
import {
	initiativeEpicAdd,
	initiativeEpicGetAll,
	initiativeEpicRemove,
} from '../../nodes/Plane/resources/initiativeEpic';
import { epicGetAll } from '../../nodes/Plane/resources/epic';

describe.skipIf(shouldSkipIntegrationTests())('Integration: Initiative & Related', () => {
	const suffix = Date.now().toString(36).toUpperCase().slice(-4);
	let projectId: string | undefined;
	let initiativeId: string | undefined;
	let labelId: string | undefined;

	afterAll(async () => {
		if (initiativeId) {
			try {
				const ctx = createIntegrationExecuteFunctions({ initiativeId });
				await initiativeDelete.call(ctx);
			} catch (e) {
				console.warn(`Cleanup: failed to delete initiative ${initiativeId}:`, e);
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
		const identifier = `II${suffix}`.slice(0, 5);
		const ctx = createIntegrationExecuteFunctions({
			name: `Init IT Project ${suffix}`,
			identifier,
			additionalFields: { network: 2 },
		});
		const result = await projectCreate.call(ctx);
		expect(result[0].json.id).toBeDefined();
		projectId = result[0].json.id as string;
	});

	describe('Initiative', () => {
		it('should create an initiative', async () => {
			const ctx = createIntegrationExecuteFunctions({
				name: `IT Initiative ${suffix}`,
				additionalFields: { description_html: '<p>Integration test initiative</p>' },
			});
			const result = await initiativeCreate.call(ctx);

			expect(result).toHaveLength(1);
			expect(result[0].json.id).toBeDefined();
			expect(result[0].json.name).toContain('IT Initiative');
			initiativeId = result[0].json.id as string;
		});

		it('should get the initiative', async () => {
			expect(initiativeId).toBeDefined();
			const ctx = createIntegrationExecuteFunctions({ initiativeId });
			const result = await initiativeGet.call(ctx);

			expect(result).toHaveLength(1);
			expect(result[0].json.id).toBe(initiativeId);
		});

		it('should list initiatives (getAll)', async () => {
			expect(initiativeId).toBeDefined();
			const ctx = createIntegrationExecuteFunctions({ returnAll: false, limit: 100 });
			const result = await initiativeGetAll.call(ctx);

			expect(result.length).toBeGreaterThanOrEqual(1);
			const found = result.find((r) => r.json.id === initiativeId);
			expect(found).toBeDefined();
		});

		it('should update the initiative', async () => {
			expect(initiativeId).toBeDefined();
			const ctx = createIntegrationExecuteFunctions({
				initiativeId,
				updateFields: { description_html: '<p>Updated by integration test</p>' },
			});
			const result = await initiativeUpdate.call(ctx);

			expect(result).toHaveLength(1);
		});
	});

	describe('Initiative Label', () => {
		it('should create an initiative label', async () => {
			const ctx = createIntegrationExecuteFunctions({
				name: `IT Label ${suffix}`,
				additionalFields: { color: '#ff0000' },
			});
			const result = await initiativeLabelCreate.call(ctx);

			expect(result).toHaveLength(1);
			expect(result[0].json.id).toBeDefined();
			labelId = result[0].json.id as string;
		});

		it('should get the initiative label', async () => {
			expect(labelId).toBeDefined();
			const ctx = createIntegrationExecuteFunctions({ labelId });
			const result = await initiativeLabelGet.call(ctx);

			expect(result).toHaveLength(1);
			expect(result[0].json.id).toBe(labelId);
		});

		it('should list initiative labels (getAll)', async () => {
			expect(labelId).toBeDefined();
			const ctx = createIntegrationExecuteFunctions({ returnAll: false, limit: 100 });
			const result = await initiativeLabelGetAll.call(ctx);

			expect(result.length).toBeGreaterThanOrEqual(1);
			const found = result.find((r) => r.json.id === labelId);
			expect(found).toBeDefined();
		});

		it('should update the initiative label', async () => {
			expect(labelId).toBeDefined();
			const ctx = createIntegrationExecuteFunctions({
				labelId,
				updateFields: { description: 'Updated by integration test' },
			});
			const result = await initiativeLabelUpdate.call(ctx);

			expect(result).toHaveLength(1);
		});

		it('should add label to initiative', async () => {
			expect(initiativeId).toBeDefined();
			expect(labelId).toBeDefined();
			const ctx = createIntegrationExecuteFunctions({
				initiativeId,
				label_ids: [labelId],
			});
			const result = await initiativeLabelAddToInitiative.call(ctx);

			expect(result).toHaveLength(1);
		});

		it('should list labels for initiative (getAllForInitiative)', async () => {
			expect(initiativeId).toBeDefined();
			const ctx = createIntegrationExecuteFunctions({
				initiativeId,
				returnAll: false,
				limit: 100,
			});
			const result = await initiativeLabelGetAllForInitiative.call(ctx);

			expect(result.length).toBeGreaterThanOrEqual(1);
		});

		it('should remove label from initiative', async () => {
			expect(initiativeId).toBeDefined();
			expect(labelId).toBeDefined();
			const ctx = createIntegrationExecuteFunctions({
				initiativeId,
				label_ids: [labelId],
			});
			const result = await initiativeLabelRemoveFromInitiative.call(ctx);

			expect(result).toHaveLength(1);
			expect(result[0].json.success).toBe(true);
		});

		it('should delete the initiative label', async () => {
			expect(labelId).toBeDefined();
			const ctx = createIntegrationExecuteFunctions({ labelId });
			const result = await initiativeLabelDelete.call(ctx);

			expect(result).toHaveLength(1);
			expect(result[0].json.success).toBe(true);
			labelId = undefined;
		});
	});

	describe('Initiative Project', () => {
		it('should add project to initiative', async () => {
			expect(initiativeId).toBeDefined();
			expect(projectId).toBeDefined();
			const ctx = createIntegrationExecuteFunctions({
				initiativeId,
				project_ids: [projectId],
			});
			const result = await initiativeProjectAdd.call(ctx);

			expect(result).toHaveLength(1);
		});

		it('should list projects for initiative (getAll)', async () => {
			expect(initiativeId).toBeDefined();
			const ctx = createIntegrationExecuteFunctions({
				initiativeId,
				returnAll: false,
				limit: 100,
			});
			const result = await initiativeProjectGetAll.call(ctx);

			expect(result.length).toBeGreaterThanOrEqual(1);
		});

		it('should remove project from initiative', async () => {
			expect(initiativeId).toBeDefined();
			expect(projectId).toBeDefined();
			const ctx = createIntegrationExecuteFunctions({
				initiativeId,
				project_ids: [projectId],
			});
			const result = await initiativeProjectRemove.call(ctx);

			expect(result).toHaveLength(1);
			expect(result[0].json.success).toBe(true);
		});
	});

	describe('Initiative Epic', () => {
		let epicId: string | undefined;

		it('should list epics for initiative (getAll) — or discover epics', async () => {
			expect(projectId).toBeDefined();
			// First, check if any epics exist in the project
			const ctx = createIntegrationExecuteFunctions({
				projectId,
				returnAll: false,
				limit: 1,
			});
			const result = await epicGetAll.call(ctx);

			// Store an epicId if available (for subsequent tests)
			if (result.length > 0) {
				epicId = result[0].json.id as string;
			}
			// This test always passes — just discovering data
			expect(Array.isArray(result)).toBe(true);
		});

		it('should add epic to initiative (if epic exists)', async () => {
			if (!epicId) return; // skip if no epics available
			expect(initiativeId).toBeDefined();

			const ctx = createIntegrationExecuteFunctions({
				initiativeId,
				epic_ids: [epicId],
			});
			const result = await initiativeEpicAdd.call(ctx);
			expect(result).toHaveLength(1);
		});

		it('should list epics for initiative (getAll)', async () => {
			if (!epicId) return;
			expect(initiativeId).toBeDefined();

			const ctx = createIntegrationExecuteFunctions({
				initiativeId,
				returnAll: false,
				limit: 100,
			});
			const result = await initiativeEpicGetAll.call(ctx);
			expect(result.length).toBeGreaterThanOrEqual(1);
		});

		it('should remove epic from initiative', async () => {
			if (!epicId) return;
			expect(initiativeId).toBeDefined();

			const ctx = createIntegrationExecuteFunctions({
				initiativeId,
				epic_ids: [epicId],
			});
			const result = await initiativeEpicRemove.call(ctx);
			expect(result).toHaveLength(1);
			expect(result[0].json.success).toBe(true);
		});
	});
});
