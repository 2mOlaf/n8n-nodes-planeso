import { describe, it, expect, afterAll } from 'bun:test';
import {
	createIntegrationExecuteFunctions,
	shouldSkipIntegrationTests,
} from './helpers/integrationExecuteFunctions';
import {
	projectCreate,
	projectDelete,
} from '../../nodes/Plane/resources/project';
import { userGetMe } from '../../nodes/Plane/resources/user';
import {
	teamspaceCreate,
	teamspaceGet,
	teamspaceGetAll,
	teamspaceUpdate,
	teamspaceDelete,
} from '../../nodes/Plane/resources/teamspace';
import {
	teamspaceMemberAdd,
	teamspaceMemberGetAll,
	teamspaceMemberRemove,
} from '../../nodes/Plane/resources/teamspaceMember';
import {
	teamspaceProjectAdd,
	teamspaceProjectGetAll,
	teamspaceProjectRemove,
} from '../../nodes/Plane/resources/teamspaceProject';

describe.skipIf(shouldSkipIntegrationTests())('Integration: Teamspace & Related', () => {
	const suffix = Date.now().toString(36).toUpperCase().slice(-4);
	let projectId: string | undefined;
	let teamspaceId: string | undefined;
	let userId: string | undefined;

	afterAll(async () => {
		if (teamspaceId) {
			try {
				const ctx = createIntegrationExecuteFunctions({ teamspaceId });
				await teamspaceDelete.call(ctx);
			} catch (e) {
				console.warn(`Cleanup: failed to delete teamspace ${teamspaceId}:`, e);
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

	it('setup: create project and get current user', async () => {
		const identifier = `TS${suffix}`.slice(0, 5);
		const projCtx = createIntegrationExecuteFunctions({
			name: `TS IT Project ${suffix}`,
			identifier,
			additionalFields: { network: 2 },
		});
		const projResult = await projectCreate.call(projCtx);
		projectId = projResult[0].json.id as string;

		const userCtx = createIntegrationExecuteFunctions({});
		const userResult = await userGetMe.call(userCtx);
		userId = userResult[0].json.id as string;

		expect(projectId).toBeDefined();
		expect(userId).toBeDefined();
	});

	describe('Teamspace', () => {
		it('should create a teamspace', async () => {
			const ctx = createIntegrationExecuteFunctions({
				name: `IT Teamspace ${suffix}`,
				additionalFields: {},
			});
			const result = await teamspaceCreate.call(ctx);

			expect(result).toHaveLength(1);
			expect(result[0].json.id).toBeDefined();
			teamspaceId = result[0].json.id as string;
		});

		it('should get the teamspace', async () => {
			expect(teamspaceId).toBeDefined();
			const ctx = createIntegrationExecuteFunctions({ teamspaceId });
			const result = await teamspaceGet.call(ctx);

			expect(result).toHaveLength(1);
			expect(result[0].json.id).toBe(teamspaceId);
		});

		it('should list teamspaces (getAll)', async () => {
			expect(teamspaceId).toBeDefined();
			const ctx = createIntegrationExecuteFunctions({ returnAll: false, limit: 100 });
			const result = await teamspaceGetAll.call(ctx);

			expect(result.length).toBeGreaterThanOrEqual(1);
			const found = result.find((r) => r.json.id === teamspaceId);
			expect(found).toBeDefined();
		});

		it('should update the teamspace', async () => {
			expect(teamspaceId).toBeDefined();
			const ctx = createIntegrationExecuteFunctions({
				teamspaceId,
				updateFields: { description_html: '<p>Updated by integration test</p>' },
			});
			const result = await teamspaceUpdate.call(ctx);

			expect(result).toHaveLength(1);
		});
	});

	describe('Teamspace Member', () => {
		it('should add member to teamspace', async () => {
			expect(teamspaceId).toBeDefined();
			expect(userId).toBeDefined();
			const ctx = createIntegrationExecuteFunctions({
				teamspaceId,
				member_ids: [userId],
			});
			const result = await teamspaceMemberAdd.call(ctx);

			expect(result.length).toBeGreaterThanOrEqual(1);
		});

		it('should list teamspace members (getAll)', async () => {
			expect(teamspaceId).toBeDefined();
			const ctx = createIntegrationExecuteFunctions({
				teamspaceId,
				returnAll: false,
				limit: 100,
			});
			const result = await teamspaceMemberGetAll.call(ctx);

			expect(result.length).toBeGreaterThanOrEqual(1);
		});

		it('should remove member from teamspace', async () => {
			expect(teamspaceId).toBeDefined();
			expect(userId).toBeDefined();
			const ctx = createIntegrationExecuteFunctions({
				teamspaceId,
				member_ids: [userId],
			});
			const result = await teamspaceMemberRemove.call(ctx);

			expect(result).toHaveLength(1);
			expect(result[0].json.success).toBe(true);
		});
	});

	describe('Teamspace Project', () => {
		it('should add project to teamspace', async () => {
			expect(teamspaceId).toBeDefined();
			expect(projectId).toBeDefined();
			const ctx = createIntegrationExecuteFunctions({
				teamspaceId,
				project_ids: [projectId],
			});
			const result = await teamspaceProjectAdd.call(ctx);

			expect(result.length).toBeGreaterThanOrEqual(1);
		});

		it('should list teamspace projects (getAll)', async () => {
			expect(teamspaceId).toBeDefined();
			const ctx = createIntegrationExecuteFunctions({
				teamspaceId,
				returnAll: false,
				limit: 100,
			});
			const result = await teamspaceProjectGetAll.call(ctx);

			expect(result.length).toBeGreaterThanOrEqual(1);
		});

		it('should remove project from teamspace', async () => {
			expect(teamspaceId).toBeDefined();
			expect(projectId).toBeDefined();
			const ctx = createIntegrationExecuteFunctions({
				teamspaceId,
				project_ids: [projectId],
			});
			const result = await teamspaceProjectRemove.call(ctx);

			expect(result).toHaveLength(1);
			expect(result[0].json.success).toBe(true);
		});
	});
});
