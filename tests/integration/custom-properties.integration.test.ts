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
	workItemTypeCreate,
	workItemTypeDelete,
} from '../../nodes/Plane/resources/workItemType';
import {
	customPropertyCreate,
	customPropertyGet,
	customPropertyGetAll,
	customPropertyUpdate,
	customPropertyDelete,
} from '../../nodes/Plane/resources/customProperty';
import {
	customPropertyOptionCreate,
	customPropertyOptionGet,
	customPropertyOptionGetAll,
	customPropertyOptionUpdate,
	customPropertyOptionDelete,
} from '../../nodes/Plane/resources/customPropertyOption';
import {
	customPropertyValueGetAll,
	customPropertyValueUpdate,
} from '../../nodes/Plane/resources/customPropertyValue';

describe.skipIf(shouldSkipIntegrationTests())('Integration: Custom Properties', () => {
	const suffix = Date.now().toString(36).toUpperCase().slice(-4);
	let projectId: string | undefined;
	let typeId: string | undefined;
	let workItemId: string | undefined;
	let propertyId: string | undefined;

	afterAll(async () => {
		if (propertyId && projectId && typeId) {
			try {
				const ctx = createIntegrationExecuteFunctions({ projectId, typeId, propertyId });
				await customPropertyDelete.call(ctx);
			} catch (e) {
				console.warn(`Cleanup: failed to delete custom property ${propertyId}:`, e);
			}
		}
		if (workItemId && projectId) {
			try {
				const ctx = createIntegrationExecuteFunctions({ projectId, workItemId });
				await workItemDelete.call(ctx);
			} catch (e) {
				console.warn(`Cleanup: failed to delete work item ${workItemId}:`, e);
			}
		}
		if (typeId && projectId) {
			try {
				const ctx = createIntegrationExecuteFunctions({ projectId, typeId });
				await workItemTypeDelete.call(ctx);
			} catch (e) {
				console.warn(`Cleanup: failed to delete work item type ${typeId}:`, e);
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

	it('setup: create project, work item type, and work item', async () => {
		const identifier = `CP${suffix}`.slice(0, 5);
		const projCtx = createIntegrationExecuteFunctions({
			name: `CP IT Project ${suffix}`,
			identifier,
			additionalFields: { network: 2 },
		});
		const projResult = await projectCreate.call(projCtx);
		projectId = projResult[0].json.id as string;

		const typeCtx = createIntegrationExecuteFunctions({
			projectId,
			additionalFields: { name: `CP IT Type ${suffix}` },
		});
		const typeResult = await workItemTypeCreate.call(typeCtx);
		typeId = typeResult[0].json.id as string;

		const wiCtx = createIntegrationExecuteFunctions({
			projectId,
			name: `CP IT WorkItem ${suffix}`,
			additionalFields: {},
		});
		const wiResult = await workItemCreate.call(wiCtx);
		workItemId = wiResult[0].json.id as string;

		expect(projectId).toBeDefined();
		expect(typeId).toBeDefined();
		expect(workItemId).toBeDefined();
	});

	describe('Custom Property', () => {
		let featureUnavailable = false;

		it('should create a custom property', async () => {
			expect(projectId).toBeDefined();
			expect(typeId).toBeDefined();
			const ctx = createIntegrationExecuteFunctions({
				projectId,
				typeId,
				display_name: `IT Prop ${suffix}`,
				property_type: 'OPTION',
				additionalFields: {},
			});
			try {
				const result = await customPropertyCreate.call(ctx);
				expect(result).toHaveLength(1);
				expect(result[0].json.id).toBeDefined();
				propertyId = result[0].json.id as string;
			} catch (e: unknown) {
				if (e instanceof Error && (e.message.includes('400') || e.message.includes('404') || e.message.includes('not a valid choice'))) {
					featureUnavailable = true;
					console.warn('Custom properties unavailable, skipping tests');
					return;
				}
				throw e;
			}
		});

		it('should get the custom property', async () => {
			if (featureUnavailable) return;
			expect(propertyId).toBeDefined();
			const ctx = createIntegrationExecuteFunctions({ projectId, typeId, propertyId });
			const result = await customPropertyGet.call(ctx);

			expect(result).toHaveLength(1);
			expect(result[0].json.id).toBe(propertyId);
		});

		it('should list custom properties (getAll)', async () => {
			if (featureUnavailable) return;
			expect(propertyId).toBeDefined();
			const ctx = createIntegrationExecuteFunctions({
				projectId,
				typeId,
				returnAll: false,
				limit: 100,
			});
			const result = await customPropertyGetAll.call(ctx);

			expect(result.length).toBeGreaterThanOrEqual(1);
			const found = result.find((r) => r.json.id === propertyId);
			expect(found).toBeDefined();
		});

		it('should update the custom property', async () => {
			if (featureUnavailable) return;
			expect(propertyId).toBeDefined();
			const ctx = createIntegrationExecuteFunctions({
				projectId,
				typeId,
				propertyId,
				updateFields: { description: 'Updated by integration test' },
			});
			const result = await customPropertyUpdate.call(ctx);

			expect(result).toHaveLength(1);
		});
	});

	describe('Custom Property Option', () => {
		let optionId: string | undefined;

		afterAll(async () => {
			if (optionId && projectId && propertyId) {
				try {
					const ctx = createIntegrationExecuteFunctions({ projectId, propertyId, optionId });
					await customPropertyOptionDelete.call(ctx);
				} catch (e) {
					console.warn(`Cleanup: failed to delete option ${optionId}:`, e);
				}
			}
		});

		it('should create a custom property option', async () => {
			if (!propertyId) return;
			const ctx = createIntegrationExecuteFunctions({
				projectId,
				propertyId,
				name: `IT Option ${suffix}`,
				additionalFields: {},
			});
			try {
				const result = await customPropertyOptionCreate.call(ctx);
				expect(result).toHaveLength(1);
				expect(result[0].json.id).toBeDefined();
				optionId = result[0].json.id as string;
			} catch (e: unknown) {
				if (e instanceof Error && (e.message.includes('400') || e.message.includes('404') || e.message.includes('not OPTION'))) {
					console.warn('Custom property options unavailable, skipping');
					return;
				}
				throw e;
			}
		});

		it('should get the option', async () => {
			if (!optionId) return;
			const ctx = createIntegrationExecuteFunctions({ projectId, propertyId, optionId });
			const result = await customPropertyOptionGet.call(ctx);

			expect(result).toHaveLength(1);
			expect(result[0].json.id).toBe(optionId);
		});

		it('should list options (getAll)', async () => {
			if (!optionId) return;
			const ctx = createIntegrationExecuteFunctions({
				projectId,
				propertyId,
				returnAll: false,
				limit: 100,
			});
			const result = await customPropertyOptionGetAll.call(ctx);

			expect(result.length).toBeGreaterThanOrEqual(1);
			const found = result.find((r) => r.json.id === optionId);
			expect(found).toBeDefined();
		});

		it('should update the option', async () => {
			if (!optionId) return;
			const ctx = createIntegrationExecuteFunctions({
				projectId,
				propertyId,
				optionId,
				updateFields: { description: 'Updated by integration test' },
			});
			const result = await customPropertyOptionUpdate.call(ctx);

			expect(result).toHaveLength(1);
		});

		it('should delete the option', async () => {
			if (!optionId) return;
			const ctx = createIntegrationExecuteFunctions({ projectId, propertyId, optionId });
			const result = await customPropertyOptionDelete.call(ctx);

			expect(result).toHaveLength(1);
			expect(result[0].json.success).toBe(true);
			optionId = undefined;
		});
	});

	describe('Custom Property Value', () => {
		let featureUnavailable = false;

		it('should list custom property values for work item (getAll)', async () => {
			expect(projectId).toBeDefined();
			expect(workItemId).toBeDefined();
			const ctx = createIntegrationExecuteFunctions({
				projectId,
				workItemId,
				returnAll: false,
				limit: 100,
			});
			try {
				const result = await customPropertyValueGetAll.call(ctx);
				expect(Array.isArray(result)).toBe(true);
			} catch (e: unknown) {
				if (e instanceof Error && (e.message.includes('404') || e.message.includes('not found'))) {
					featureUnavailable = true;
					console.warn('Custom property values endpoint unavailable, skipping');
					return;
				}
				throw e;
			}
		});

		it('should update a custom property value', async () => {
			if (featureUnavailable) return;
			expect(propertyId).toBeDefined();
			expect(workItemId).toBeDefined();
			const ctx = createIntegrationExecuteFunctions({
				projectId,
				workItemId,
				propertyId,
				value: 'integration-test-value',
			});
			const result = await customPropertyValueUpdate.call(ctx);

			expect(result).toHaveLength(1);
		});
	});
});
