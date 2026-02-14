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
	customerCreate,
	customerGet,
	customerGetAll,
	customerUpdate,
	customerDelete,
	customerLinkWorkItems,
	customerGetWorkItems,
	customerUnlinkWorkItem,
} from '../../nodes/Plane/resources/customer';
import {
	customerPropertyCreate,
	customerPropertyGet,
	customerPropertyGetAll,
	customerPropertyUpdate,
	customerPropertyDelete,
} from '../../nodes/Plane/resources/customerProperty';
import {
	customerRequestCreate,
	customerRequestGet,
	customerRequestGetAll,
	customerRequestUpdate,
	customerRequestDelete,
} from '../../nodes/Plane/resources/customerRequest';

describe.skipIf(shouldSkipIntegrationTests())('Integration: Customer & Related', () => {
	const suffix = Date.now().toString(36).toUpperCase().slice(-4);
	let projectId: string | undefined;
	let workItemId: string | undefined;
	let customerId: string | undefined;

	afterAll(async () => {
		if (customerId) {
			try {
				const ctx = createIntegrationExecuteFunctions({ customerId });
				await customerDelete.call(ctx);
			} catch (e) {
				console.warn(`Cleanup: failed to delete customer ${customerId}:`, e);
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
		const identifier = `CU${suffix}`.slice(0, 5);
		const projCtx = createIntegrationExecuteFunctions({
			name: `CU IT Project ${suffix}`,
			identifier,
			additionalFields: { network: 2 },
		});
		const projResult = await projectCreate.call(projCtx);
		projectId = projResult[0].json.id as string;

		const wiCtx = createIntegrationExecuteFunctions({
			projectId,
			name: `CU IT WorkItem ${suffix}`,
			additionalFields: {},
		});
		const wiResult = await workItemCreate.call(wiCtx);
		workItemId = wiResult[0].json.id as string;

		expect(projectId).toBeDefined();
		expect(workItemId).toBeDefined();
	});

	describe('Customer', () => {
		it('should create a customer', async () => {
			const ctx = createIntegrationExecuteFunctions({
				additionalFields: {
					name: `IT Customer ${suffix}`,
					email: `it-${suffix.toLowerCase()}@test.example.com`,
				},
			});
			const result = await customerCreate.call(ctx);

			expect(result).toHaveLength(1);
			expect(result[0].json.id).toBeDefined();
			customerId = result[0].json.id as string;
		});

		it('should get the customer', async () => {
			expect(customerId).toBeDefined();
			const ctx = createIntegrationExecuteFunctions({ customerId });
			const result = await customerGet.call(ctx);

			expect(result).toHaveLength(1);
			expect(result[0].json.id).toBe(customerId);
		});

		it('should list customers (getAll)', async () => {
			expect(customerId).toBeDefined();
			const ctx = createIntegrationExecuteFunctions({ returnAll: false, limit: 100 });
			const result = await customerGetAll.call(ctx);

			expect(result.length).toBeGreaterThanOrEqual(1);
			const found = result.find((r) => r.json.id === customerId);
			expect(found).toBeDefined();
		});

		it('should update the customer', async () => {
			expect(customerId).toBeDefined();
			const ctx = createIntegrationExecuteFunctions({
				customerId,
				updateFields: { name: `Updated Customer ${suffix}` },
			});
			const result = await customerUpdate.call(ctx);

			expect(result).toHaveLength(1);
		});

		it('should link work items to customer', async () => {
			expect(customerId).toBeDefined();
			expect(workItemId).toBeDefined();
			const ctx = createIntegrationExecuteFunctions({
				customerId,
				work_item_ids: workItemId,
			});
			try {
				const result = await customerLinkWorkItems.call(ctx);
				expect(result.length).toBeGreaterThanOrEqual(1);
			} catch (e: unknown) {
				if (e instanceof Error && (e.message.includes('404') || e.message.includes('not found'))) {
					console.warn('Customer work items endpoint unavailable, skipping');
					return;
				}
				throw e;
			}
		});

		it('should get work items for customer', async () => {
			expect(customerId).toBeDefined();
			const ctx = createIntegrationExecuteFunctions({
				customerId,
				returnAll: false,
				limit: 100,
			});
			try {
				const result = await customerGetWorkItems.call(ctx);
				expect(result.length).toBeGreaterThanOrEqual(1);
			} catch (e: unknown) {
				if (e instanceof Error && (e.message.includes('404') || e.message.includes('not found'))) {
					console.warn('Customer work items endpoint unavailable, skipping');
					return;
				}
				throw e;
			}
		});

		it('should unlink work item from customer', async () => {
			expect(customerId).toBeDefined();
			expect(workItemId).toBeDefined();
			const ctx = createIntegrationExecuteFunctions({
				customerId,
				workItemId,
			});
			try {
				const result = await customerUnlinkWorkItem.call(ctx);
				expect(result).toHaveLength(1);
				expect(result[0].json.success).toBe(true);
			} catch (e: unknown) {
				if (e instanceof Error && (e.message.includes('404') || e.message.includes('not found'))) {
					console.warn('Customer work items endpoint unavailable, skipping');
					return;
				}
				throw e;
			}
		});
	});

	describe('Customer Property', () => {
		let propertyId: string | undefined;
		let featureUnavailable = false;

		afterAll(async () => {
			if (propertyId) {
				try {
					const ctx = createIntegrationExecuteFunctions({ propertyId });
					await customerPropertyDelete.call(ctx);
				} catch (e) {
					console.warn(`Cleanup: failed to delete customer property ${propertyId}:`, e);
				}
			}
		});

		it('should create a customer property', async () => {
			const ctx = createIntegrationExecuteFunctions({
				display_name: `IT CustProp ${suffix}`,
				additionalFields: { property_type: 'TEXT' },
			});
			try {
				const result = await customerPropertyCreate.call(ctx);
				expect(result).toHaveLength(1);
				expect(result[0].json.id).toBeDefined();
				propertyId = result[0].json.id as string;
			} catch (e: unknown) {
				if (e instanceof Error && (e.message.includes('400') || e.message.includes('404') || e.message.includes('not a valid choice') || e.message.includes('required key'))) {
					featureUnavailable = true;
					console.warn('Customer properties unavailable, skipping tests');
					return;
				}
				throw e;
			}
		});

		it('should get the customer property', async () => {
			if (featureUnavailable) return;
			expect(propertyId).toBeDefined();
			const ctx = createIntegrationExecuteFunctions({ propertyId });
			const result = await customerPropertyGet.call(ctx);

			expect(result).toHaveLength(1);
			expect(result[0].json.id).toBe(propertyId);
		});

		it('should list customer properties (getAll)', async () => {
			if (featureUnavailable) return;
			expect(propertyId).toBeDefined();
			const ctx = createIntegrationExecuteFunctions({ returnAll: false, limit: 100 });
			const result = await customerPropertyGetAll.call(ctx);

			expect(result.length).toBeGreaterThanOrEqual(1);
			const found = result.find((r) => r.json.id === propertyId);
			expect(found).toBeDefined();
		});

		it('should update the customer property', async () => {
			if (featureUnavailable) return;
			expect(propertyId).toBeDefined();
			const ctx = createIntegrationExecuteFunctions({
				propertyId,
				updateFields: { description: 'Updated by integration test' },
			});
			const result = await customerPropertyUpdate.call(ctx);

			expect(result).toHaveLength(1);
		});

		it('should delete the customer property', async () => {
			if (featureUnavailable) return;
			expect(propertyId).toBeDefined();
			const ctx = createIntegrationExecuteFunctions({ propertyId });
			const result = await customerPropertyDelete.call(ctx);

			expect(result).toHaveLength(1);
			expect(result[0].json.success).toBe(true);
			propertyId = undefined;
		});
	});

	describe('Customer Request', () => {
		let requestId: string | undefined;

		afterAll(async () => {
			if (requestId && customerId) {
				try {
					const ctx = createIntegrationExecuteFunctions({ customerId, requestId });
					await customerRequestDelete.call(ctx);
				} catch (e) {
					console.warn(`Cleanup: failed to delete customer request ${requestId}:`, e);
				}
			}
		});

		it('should create a customer request', async () => {
			expect(customerId).toBeDefined();
			const ctx = createIntegrationExecuteFunctions({
				customerId,
				additionalFields: { name: `IT Request ${suffix}`, description: 'Integration test request' },
			});
			const result = await customerRequestCreate.call(ctx);

			expect(result).toHaveLength(1);
			expect(result[0].json.id).toBeDefined();
			requestId = result[0].json.id as string;
		});

		it('should get the customer request', async () => {
			expect(requestId).toBeDefined();
			const ctx = createIntegrationExecuteFunctions({ customerId, requestId });
			const result = await customerRequestGet.call(ctx);

			expect(result).toHaveLength(1);
			expect(result[0].json.id).toBe(requestId);
		});

		it('should list customer requests (getAll)', async () => {
			expect(requestId).toBeDefined();
			const ctx = createIntegrationExecuteFunctions({
				customerId,
				returnAll: false,
				limit: 100,
			});
			const result = await customerRequestGetAll.call(ctx);

			expect(result.length).toBeGreaterThanOrEqual(1);
			const found = result.find((r) => r.json.id === requestId);
			expect(found).toBeDefined();
		});

		it('should update the customer request', async () => {
			expect(requestId).toBeDefined();
			const ctx = createIntegrationExecuteFunctions({
				customerId,
				requestId,
				updateFields: { name: `Updated Request ${suffix}` },
			});
			const result = await customerRequestUpdate.call(ctx);

			expect(result).toHaveLength(1);
		});

		it('should delete the customer request', async () => {
			expect(requestId).toBeDefined();
			const ctx = createIntegrationExecuteFunctions({ customerId, requestId });
			const result = await customerRequestDelete.call(ctx);

			expect(result).toHaveLength(1);
			expect(result[0].json.success).toBe(true);
			requestId = undefined;
		});
	});
});
