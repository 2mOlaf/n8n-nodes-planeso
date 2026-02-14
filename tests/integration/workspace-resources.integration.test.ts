import { describe, it, expect, afterAll } from 'bun:test';
import {
	createIntegrationExecuteFunctions,
	shouldSkipIntegrationTests,
} from './helpers/integrationExecuteFunctions';
import {
	stickyCreate,
	stickyGet,
	stickyGetAll,
	stickyUpdate,
	stickyDelete,
} from '../../nodes/Plane/resources/sticky';
import {
	intakeCreate,
	intakeGet,
	intakeGetAll,
	intakeUpdate,
	intakeDelete,
} from '../../nodes/Plane/resources/intake';

describe.skipIf(shouldSkipIntegrationTests())('Integration: Workspace Resources', () => {
	const suffix = Date.now().toString(36).toUpperCase().slice(-4);

	describe('Sticky', () => {
		let stickyId: string | undefined;

		afterAll(async () => {
			if (stickyId) {
				try {
					const ctx = createIntegrationExecuteFunctions({ stickyId });
					await stickyDelete.call(ctx);
				} catch (e) {
					console.warn(`Cleanup: failed to delete sticky ${stickyId}:`, e);
				}
			}
		});

		it('should create a sticky', async () => {
			const ctx = createIntegrationExecuteFunctions({
				additionalFields: {
					name: `IT Sticky ${suffix}`,
					description_html: '<p>Integration test sticky</p>',
				},
			});
			const result = await stickyCreate.call(ctx);

			expect(result).toHaveLength(1);
			expect(result[0].json.id).toBeDefined();
			stickyId = result[0].json.id as string;
		});

		it('should get the sticky', async () => {
			expect(stickyId).toBeDefined();
			const ctx = createIntegrationExecuteFunctions({ stickyId });
			const result = await stickyGet.call(ctx);

			expect(result).toHaveLength(1);
			expect(result[0].json.id).toBe(stickyId);
		});

		it('should list stickies (getAll)', async () => {
			expect(stickyId).toBeDefined();
			const ctx = createIntegrationExecuteFunctions({ returnAll: false, limit: 100 });
			const result = await stickyGetAll.call(ctx);

			expect(result.length).toBeGreaterThanOrEqual(1);
			const found = result.find((r) => r.json.id === stickyId);
			expect(found).toBeDefined();
		});

		it('should update the sticky', async () => {
			expect(stickyId).toBeDefined();
			const ctx = createIntegrationExecuteFunctions({
				stickyId,
				updateFields: { name: `Updated Sticky ${suffix}` },
			});
			const result = await stickyUpdate.call(ctx);

			expect(result).toHaveLength(1);
		});

		it('should delete the sticky', async () => {
			expect(stickyId).toBeDefined();
			const ctx = createIntegrationExecuteFunctions({ stickyId });
			const result = await stickyDelete.call(ctx);

			expect(result).toHaveLength(1);
			expect(result[0].json.success).toBe(true);
			stickyId = undefined;
		});
	});

	describe('Intake', () => {
		let intakeId: string | undefined;
		let featureUnavailable = false;

		afterAll(async () => {
			if (intakeId) {
				try {
					const ctx = createIntegrationExecuteFunctions({ intakeId });
					await intakeDelete.call(ctx);
				} catch (e) {
					console.warn(`Cleanup: failed to delete intake ${intakeId}:`, e);
				}
			}
		});

		it('should create an intake', async () => {
			const ctx = createIntegrationExecuteFunctions({
				additionalFields: {
					name: `IT Intake ${suffix}`,
					description_html: '<p>Integration test intake</p>',
				},
			});
			try {
				const result = await intakeCreate.call(ctx);
				expect(result).toHaveLength(1);
				expect(result[0].json.id).toBeDefined();
				intakeId = result[0].json.id as string;
			} catch (e: unknown) {
				if (e instanceof Error && (e.message.includes('404') || e.message.includes('not found'))) {
					featureUnavailable = true;
					console.warn('Intake endpoint unavailable, skipping tests');
					return;
				}
				throw e;
			}
		});

		it('should get the intake', async () => {
			if (featureUnavailable) return;
			expect(intakeId).toBeDefined();
			const ctx = createIntegrationExecuteFunctions({ intakeId });
			const result = await intakeGet.call(ctx);

			expect(result).toHaveLength(1);
			expect(result[0].json.id).toBe(intakeId);
		});

		it('should list intakes (getAll)', async () => {
			if (featureUnavailable) return;
			expect(intakeId).toBeDefined();
			const ctx = createIntegrationExecuteFunctions({ returnAll: false, limit: 100 });
			const result = await intakeGetAll.call(ctx);

			expect(result.length).toBeGreaterThanOrEqual(1);
			const found = result.find((r) => r.json.id === intakeId);
			expect(found).toBeDefined();
		});

		it('should update the intake', async () => {
			if (featureUnavailable) return;
			expect(intakeId).toBeDefined();
			const ctx = createIntegrationExecuteFunctions({
				intakeId,
				updateFields: { name: `Updated Intake ${suffix}` },
			});
			const result = await intakeUpdate.call(ctx);

			expect(result).toHaveLength(1);
		});

		it('should delete the intake', async () => {
			if (featureUnavailable) return;
			expect(intakeId).toBeDefined();
			const ctx = createIntegrationExecuteFunctions({ intakeId });
			const result = await intakeDelete.call(ctx);

			expect(result).toHaveLength(1);
			expect(result[0].json.success).toBe(true);
			intakeId = undefined;
		});
	});
});
