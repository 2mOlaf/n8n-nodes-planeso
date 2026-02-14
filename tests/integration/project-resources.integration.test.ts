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
	cycleCreate,
	cycleGet,
	cycleGetAll,
	cycleUpdate,
	cycleDelete,
} from '../../nodes/Plane/resources/cycle';
import {
	labelCreate,
	labelGet,
	labelGetAll,
	labelUpdate,
	labelDelete,
} from '../../nodes/Plane/resources/label';
import {
	stateCreate,
	stateGet,
	stateGetAll,
	stateUpdate,
	stateDelete,
} from '../../nodes/Plane/resources/state';
import {
	moduleCreate,
	moduleGet,
	moduleGetAll,
	moduleUpdate,
	moduleDelete,
} from '../../nodes/Plane/resources/module';
import {
	workItemTypeCreate,
	workItemTypeGet,
	workItemTypeGetAll,
	workItemTypeUpdate,
	workItemTypeDelete,
} from '../../nodes/Plane/resources/workItemType';
import {
	epicGet,
	epicGetAll,
} from '../../nodes/Plane/resources/epic';

describe.skipIf(shouldSkipIntegrationTests())('Integration: Project Resources', () => {
	const suffix = Date.now().toString(36).toUpperCase().slice(-4);
	let projectId: string | undefined;

	afterAll(async () => {
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
		const identifier = `PR${suffix}`.slice(0, 5);
		const ctx = createIntegrationExecuteFunctions({
			name: `PR IT Project ${suffix}`,
			identifier,
			additionalFields: { network: 2 },
		});
		const result = await projectCreate.call(ctx);
		projectId = result[0].json.id as string;
		expect(projectId).toBeDefined();
	});

	describe('Cycle', () => {
		let cycleId: string | undefined;

		afterAll(async () => {
			if (cycleId) {
				try {
					const ctx = createIntegrationExecuteFunctions({ projectId, cycleId });
					await cycleDelete.call(ctx);
				} catch (e) {
					console.warn(`Cleanup: failed to delete cycle ${cycleId}:`, e);
				}
			}
		});

		it('should create a cycle', async () => {
			expect(projectId).toBeDefined();
			const ctx = createIntegrationExecuteFunctions({
				projectId,
				name: `IT Cycle ${suffix}`,
				additionalFields: { description: 'Integration test cycle' },
			});
			const result = await cycleCreate.call(ctx);

			expect(result).toHaveLength(1);
			expect(result[0].json.id).toBeDefined();
			cycleId = result[0].json.id as string;
		});

		it('should get the cycle', async () => {
			expect(cycleId).toBeDefined();
			const ctx = createIntegrationExecuteFunctions({ projectId, cycleId });
			const result = await cycleGet.call(ctx);

			expect(result).toHaveLength(1);
			expect(result[0].json.id).toBe(cycleId);
		});

		it('should list cycles (getAll)', async () => {
			expect(cycleId).toBeDefined();
			const ctx = createIntegrationExecuteFunctions({
				projectId,
				returnAll: false,
				limit: 100,
			});
			const result = await cycleGetAll.call(ctx);

			expect(result.length).toBeGreaterThanOrEqual(1);
			const found = result.find((r) => r.json.id === cycleId);
			expect(found).toBeDefined();
		});

		it('should update the cycle', async () => {
			expect(cycleId).toBeDefined();
			const ctx = createIntegrationExecuteFunctions({
				projectId,
				cycleId,
				updateFields: { description: 'Updated by integration test' },
			});
			const result = await cycleUpdate.call(ctx);

			expect(result).toHaveLength(1);
		});

		it('should delete the cycle', async () => {
			expect(cycleId).toBeDefined();
			const ctx = createIntegrationExecuteFunctions({ projectId, cycleId });
			const result = await cycleDelete.call(ctx);

			expect(result).toHaveLength(1);
			expect(result[0].json.success).toBe(true);
			cycleId = undefined;
		});
	});

	describe('Label', () => {
		let labelId: string | undefined;

		afterAll(async () => {
			if (labelId) {
				try {
					const ctx = createIntegrationExecuteFunctions({ projectId, labelId });
					await labelDelete.call(ctx);
				} catch (e) {
					console.warn(`Cleanup: failed to delete label ${labelId}:`, e);
				}
			}
		});

		it('should create a label', async () => {
			expect(projectId).toBeDefined();
			const ctx = createIntegrationExecuteFunctions({
				projectId,
				name: `IT Label ${suffix}`,
				additionalFields: { color: '#00ff00' },
			});
			const result = await labelCreate.call(ctx);

			expect(result).toHaveLength(1);
			expect(result[0].json.id).toBeDefined();
			labelId = result[0].json.id as string;
		});

		it('should get the label', async () => {
			expect(labelId).toBeDefined();
			const ctx = createIntegrationExecuteFunctions({ projectId, labelId });
			const result = await labelGet.call(ctx);

			expect(result).toHaveLength(1);
			expect(result[0].json.id).toBe(labelId);
		});

		it('should list labels (getAll)', async () => {
			expect(labelId).toBeDefined();
			const ctx = createIntegrationExecuteFunctions({
				projectId,
				returnAll: false,
				limit: 100,
			});
			const result = await labelGetAll.call(ctx);

			expect(result.length).toBeGreaterThanOrEqual(1);
			const found = result.find((r) => r.json.id === labelId);
			expect(found).toBeDefined();
		});

		it('should update the label', async () => {
			expect(labelId).toBeDefined();
			const ctx = createIntegrationExecuteFunctions({
				projectId,
				labelId,
				updateFields: { description: 'Updated by integration test' },
			});
			const result = await labelUpdate.call(ctx);

			expect(result).toHaveLength(1);
		});

		it('should delete the label', async () => {
			expect(labelId).toBeDefined();
			const ctx = createIntegrationExecuteFunctions({ projectId, labelId });
			const result = await labelDelete.call(ctx);

			expect(result).toHaveLength(1);
			expect(result[0].json.success).toBe(true);
			labelId = undefined;
		});
	});

	describe('State', () => {
		let stateId: string | undefined;

		afterAll(async () => {
			if (stateId) {
				try {
					const ctx = createIntegrationExecuteFunctions({ projectId, stateId });
					await stateDelete.call(ctx);
				} catch (e) {
					console.warn(`Cleanup: failed to delete state ${stateId}:`, e);
				}
			}
		});

		it('should create a state', async () => {
			expect(projectId).toBeDefined();
			const ctx = createIntegrationExecuteFunctions({
				projectId,
				name: `IT State ${suffix}`,
				color: '#0000ff',
				group: 'backlog',
				additionalFields: {},
			});
			const result = await stateCreate.call(ctx);

			expect(result).toHaveLength(1);
			expect(result[0].json.id).toBeDefined();
			stateId = result[0].json.id as string;
		});

		it('should get the state', async () => {
			expect(stateId).toBeDefined();
			const ctx = createIntegrationExecuteFunctions({ projectId, stateId });
			const result = await stateGet.call(ctx);

			expect(result).toHaveLength(1);
			expect(result[0].json.id).toBe(stateId);
		});

		it('should list states (getAll)', async () => {
			expect(stateId).toBeDefined();
			const ctx = createIntegrationExecuteFunctions({
				projectId,
				returnAll: false,
				limit: 100,
			});
			const result = await stateGetAll.call(ctx);

			expect(result.length).toBeGreaterThanOrEqual(1);
			const found = result.find((r) => r.json.id === stateId);
			expect(found).toBeDefined();
		});

		it('should update the state', async () => {
			expect(stateId).toBeDefined();
			const ctx = createIntegrationExecuteFunctions({
				projectId,
				stateId,
				updateFields: { description: 'Updated by integration test' },
			});
			const result = await stateUpdate.call(ctx);

			expect(result).toHaveLength(1);
		});

		it('should delete the state', async () => {
			expect(stateId).toBeDefined();
			const ctx = createIntegrationExecuteFunctions({ projectId, stateId });
			const result = await stateDelete.call(ctx);

			expect(result).toHaveLength(1);
			expect(result[0].json.success).toBe(true);
			stateId = undefined;
		});
	});

	describe('Module', () => {
		let moduleId: string | undefined;
		let featureDisabled = false;

		afterAll(async () => {
			if (moduleId) {
				try {
					const ctx = createIntegrationExecuteFunctions({ projectId, moduleId });
					await moduleDelete.call(ctx);
				} catch (e) {
					console.warn(`Cleanup: failed to delete module ${moduleId}:`, e);
				}
			}
		});

		it('should create a module', async () => {
			expect(projectId).toBeDefined();
			const ctx = createIntegrationExecuteFunctions({
				projectId,
				name: `IT Module ${suffix}`,
				additionalFields: { description: 'Integration test module' },
			});
			try {
				const result = await moduleCreate.call(ctx);
				expect(result).toHaveLength(1);
				expect(result[0].json.id).toBeDefined();
				moduleId = result[0].json.id as string;
			} catch (e: unknown) {
				if (e instanceof Error && (e.message.includes('not enabled') || e.message.includes('404'))) {
					featureDisabled = true;
					console.warn('Modules not enabled for project, skipping tests');
					return;
				}
				throw e;
			}
		});

		it('should get the module', async () => {
			if (featureDisabled) return;
			expect(moduleId).toBeDefined();
			const ctx = createIntegrationExecuteFunctions({ projectId, moduleId });
			const result = await moduleGet.call(ctx);

			expect(result).toHaveLength(1);
			expect(result[0].json.id).toBe(moduleId);
		});

		it('should list modules (getAll)', async () => {
			if (featureDisabled) return;
			expect(moduleId).toBeDefined();
			const ctx = createIntegrationExecuteFunctions({
				projectId,
				returnAll: false,
				limit: 100,
			});
			const result = await moduleGetAll.call(ctx);

			expect(result.length).toBeGreaterThanOrEqual(1);
			const found = result.find((r) => r.json.id === moduleId);
			expect(found).toBeDefined();
		});

		it('should update the module', async () => {
			if (featureDisabled) return;
			expect(moduleId).toBeDefined();
			const ctx = createIntegrationExecuteFunctions({
				projectId,
				moduleId,
				updateFields: { description: 'Updated by integration test' },
			});
			const result = await moduleUpdate.call(ctx);

			expect(result).toHaveLength(1);
		});

		it('should delete the module', async () => {
			if (featureDisabled) return;
			expect(moduleId).toBeDefined();
			const ctx = createIntegrationExecuteFunctions({ projectId, moduleId });
			const result = await moduleDelete.call(ctx);

			expect(result).toHaveLength(1);
			expect(result[0].json.success).toBe(true);
			moduleId = undefined;
		});
	});

	describe('Work Item Type', () => {
		let typeId: string | undefined;

		afterAll(async () => {
			if (typeId) {
				try {
					const ctx = createIntegrationExecuteFunctions({ projectId, typeId });
					await workItemTypeDelete.call(ctx);
				} catch (e) {
					console.warn(`Cleanup: failed to delete work item type ${typeId}:`, e);
				}
			}
		});

		it('should create a work item type', async () => {
			expect(projectId).toBeDefined();
			const ctx = createIntegrationExecuteFunctions({
				projectId,
				additionalFields: { name: `IT Type ${suffix}`, description: 'Integration test type' },
			});
			const result = await workItemTypeCreate.call(ctx);

			expect(result).toHaveLength(1);
			expect(result[0].json.id).toBeDefined();
			typeId = result[0].json.id as string;
		});

		it('should get the work item type', async () => {
			expect(typeId).toBeDefined();
			const ctx = createIntegrationExecuteFunctions({ projectId, typeId });
			const result = await workItemTypeGet.call(ctx);

			expect(result).toHaveLength(1);
			expect(result[0].json.id).toBe(typeId);
		});

		it('should list work item types (getAll)', async () => {
			expect(typeId).toBeDefined();
			const ctx = createIntegrationExecuteFunctions({
				projectId,
				returnAll: false,
				limit: 100,
			});
			const result = await workItemTypeGetAll.call(ctx);

			expect(result.length).toBeGreaterThanOrEqual(1);
			const found = result.find((r) => r.json.id === typeId);
			expect(found).toBeDefined();
		});

		it('should update the work item type', async () => {
			expect(typeId).toBeDefined();
			const ctx = createIntegrationExecuteFunctions({
				projectId,
				typeId,
				updateFields: { description: 'Updated by integration test' },
			});
			const result = await workItemTypeUpdate.call(ctx);

			expect(result).toHaveLength(1);
		});

		it('should delete the work item type', async () => {
			expect(typeId).toBeDefined();
			const ctx = createIntegrationExecuteFunctions({ projectId, typeId });
			const result = await workItemTypeDelete.call(ctx);

			expect(result).toHaveLength(1);
			expect(result[0].json.success).toBe(true);
			typeId = undefined;
		});
	});

	describe('Epic (read-only)', () => {
		let epicId: string | undefined;

		it('should list epics (getAll)', async () => {
			expect(projectId).toBeDefined();
			const ctx = createIntegrationExecuteFunctions({
				projectId,
				returnAll: false,
				limit: 10,
			});
			const result = await epicGetAll.call(ctx);

			expect(Array.isArray(result)).toBe(true);
			if (result.length > 0) {
				epicId = result[0].json.id as string;
			}
		});

		it('should get an epic (if any exist)', async () => {
			if (!epicId) return;
			expect(projectId).toBeDefined();

			const ctx = createIntegrationExecuteFunctions({ projectId, epicId });
			const result = await epicGet.call(ctx);

			expect(result).toHaveLength(1);
			expect(result[0].json.id).toBe(epicId);
		});
	});
});
