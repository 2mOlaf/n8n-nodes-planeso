import { describe, it, expect } from 'bun:test';
import {
	createIntegrationExecuteFunctions,
	shouldSkipIntegrationTests,
} from './helpers/integrationExecuteFunctions';
import { userGetMe } from '../../nodes/Plane/resources/user';
import { memberGetAll } from '../../nodes/Plane/resources/member';

describe.skipIf(shouldSkipIntegrationTests())('Integration: User & Member', () => {
	describe('User', () => {
		it('should get the current user (getMe)', async () => {
			const ctx = createIntegrationExecuteFunctions({});
			const result = await userGetMe.call(ctx);

			expect(result).toHaveLength(1);
			expect(result[0].json.id).toBeDefined();
			expect(result[0].json.email).toBeDefined();
		});
	});

	describe('Member', () => {
		it('should list workspace members', async () => {
			const ctx = createIntegrationExecuteFunctions({
				scope: 'workspace',
				returnAll: false,
				limit: 10,
			});
			const result = await memberGetAll.call(ctx);

			expect(result.length).toBeGreaterThanOrEqual(1);
			expect(result[0].json.id).toBeDefined();
		});
	});
});
