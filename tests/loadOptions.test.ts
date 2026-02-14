import { describe, it, expect } from 'bun:test';
import type { IDataObject, ILoadOptionsFunctions } from 'n8n-workflow';
import {
	getProjects,
	getMembers,
	getStates,
	getLabels,
	getCycles,
	getModules,
	getWorkItemTypes,
	getEpics,
	getTeamspaces,
	getInitiatives,
	getCustomers,
	getInitiativeLabels,
} from '../nodes/Plane/utils/loadOptions';

interface MockRequestCall {
	method: string;
	url: string;
}

function createMockLoadOptionsFunctions(options: {
	nodeParameters?: Record<string, unknown>;
	httpResponse?: unknown;
} = {}): { ctx: ILoadOptionsFunctions; requestCalls: MockRequestCall[] } {
	const { nodeParameters = {}, httpResponse = {} } = options;
	const requestCalls: MockRequestCall[] = [];

	const ctx = {
		getCurrentNodeParameter(name: string) {
			return nodeParameters[name] ?? undefined;
		},
		getCredentials: async () => ({
			apiKey: 'test-api-key',
			workspaceSlug: 'test-workspace',
			baseUrl: 'https://api.plane.so',
		}),
		getNode: () => ({ name: 'Plane', type: 'n8n-nodes-planeso.plane' }),
		helpers: {
			httpRequest: async (opts: IDataObject) => {
				requestCalls.push({
					method: opts.method as string,
					url: opts.url as string,
				});
				return httpResponse;
			},
		},
	} as unknown as ILoadOptionsFunctions;

	return { ctx, requestCalls };
}

describe('loadOptions', () => {
	describe('getProjects', () => {
		it('should return projects as name/value pairs', async () => {
			const { ctx } = createMockLoadOptionsFunctions({
				httpResponse: {
					results: [
						{ id: 'p1', name: 'Backend', identifier: 'BE' },
						{ id: 'p2', name: 'Frontend', identifier: 'FE' },
					],
				},
			});

			const result = await getProjects.call(ctx);

			expect(result).toEqual([
				{ name: 'BE - Backend', value: 'p1' },
				{ name: 'FE - Frontend', value: 'p2' },
			]);
		});

		it('should return empty array on error', async () => {
			const ctx = {
				getCredentials: async () => { throw new Error('No creds'); },
				getNode: () => ({ name: 'Plane' }),
				helpers: { httpRequest: async () => ({}) },
			} as unknown as ILoadOptionsFunctions;

			const result = await getProjects.call(ctx);
			expect(result).toEqual([]);
		});
	});

	describe('getMembers', () => {
		it('should return members with display names', async () => {
			const { ctx } = createMockLoadOptionsFunctions({
				httpResponse: {
					results: [
						{ id: 'm1', member: { id: 'u1', display_name: 'Alice', email: 'alice@test.com' } },
						{ id: 'm2', member: { id: 'u2', display_name: '', email: 'bob@test.com' } },
					],
				},
			});

			const result = await getMembers.call(ctx);

			expect(result).toEqual([
				{ name: 'Alice', value: 'u1' },
				{ name: 'bob@test.com', value: 'u2' },
			]);
		});
	});

	describe('getStates', () => {
		it('should return states for selected project', async () => {
			const { ctx } = createMockLoadOptionsFunctions({
				nodeParameters: { projectId: 'p1' },
				httpResponse: {
					results: [
						{ id: 's1', name: 'Open', group: 'started' },
						{ id: 's2', name: 'Closed', group: 'completed' },
					],
				},
			});

			const result = await getStates.call(ctx);

			expect(result).toEqual([
				{ name: 'started - Open', value: 's1' },
				{ name: 'completed - Closed', value: 's2' },
			]);
		});

		it('should return empty when no project selected', async () => {
			const { ctx } = createMockLoadOptionsFunctions({
				nodeParameters: {},
			});

			const result = await getStates.call(ctx);
			expect(result).toEqual([]);
		});
	});

	describe('getLabels', () => {
		it('should return labels for selected project', async () => {
			const { ctx } = createMockLoadOptionsFunctions({
				nodeParameters: { projectId: 'p1' },
				httpResponse: {
					results: [
						{ id: 'l1', name: 'Bug' },
						{ id: 'l2', name: 'Feature' },
					],
				},
			});

			const result = await getLabels.call(ctx);

			expect(result).toEqual([
				{ name: 'Bug', value: 'l1' },
				{ name: 'Feature', value: 'l2' },
			]);
		});

		it('should return empty when no project selected', async () => {
			const { ctx } = createMockLoadOptionsFunctions({});

			const result = await getLabels.call(ctx);
			expect(result).toEqual([]);
		});
	});

	describe('getCycles', () => {
		it('should return cycles for selected project', async () => {
			const { ctx } = createMockLoadOptionsFunctions({
				nodeParameters: { projectId: 'p1' },
				httpResponse: {
					results: [{ id: 'c1', name: 'Sprint 1' }],
				},
			});

			const result = await getCycles.call(ctx);
			expect(result).toEqual([{ name: 'Sprint 1', value: 'c1' }]);
		});
	});

	describe('getModules', () => {
		it('should return modules for selected project', async () => {
			const { ctx } = createMockLoadOptionsFunctions({
				nodeParameters: { projectId: 'p1' },
				httpResponse: {
					results: [{ id: 'm1', name: 'Auth Module' }],
				},
			});

			const result = await getModules.call(ctx);
			expect(result).toEqual([{ name: 'Auth Module', value: 'm1' }]);
		});
	});

	describe('getWorkItemTypes', () => {
		it('should return work item types for selected project', async () => {
			const { ctx } = createMockLoadOptionsFunctions({
				nodeParameters: { projectId: 'p1' },
				httpResponse: {
					results: [{ id: 't1', name: 'Task' }, { id: 't2', name: 'Bug' }],
				},
			});

			const result = await getWorkItemTypes.call(ctx);
			expect(result).toEqual([
				{ name: 'Task', value: 't1' },
				{ name: 'Bug', value: 't2' },
			]);
		});
	});

	describe('getEpics', () => {
		it('should return epics for selected project', async () => {
			const { ctx } = createMockLoadOptionsFunctions({
				nodeParameters: { projectId: 'p1' },
				httpResponse: {
					results: [{ id: 'e1', name: 'Authentication Epic' }],
				},
			});

			const result = await getEpics.call(ctx);
			expect(result).toEqual([{ name: 'Authentication Epic', value: 'e1' }]);
		});
	});

	describe('getTeamspaces', () => {
		it('should return teamspaces', async () => {
			const { ctx } = createMockLoadOptionsFunctions({
				httpResponse: {
					results: [{ id: 'ts1', name: 'Engineering' }],
				},
			});

			const result = await getTeamspaces.call(ctx);
			expect(result).toEqual([{ name: 'Engineering', value: 'ts1' }]);
		});
	});

	describe('getInitiatives', () => {
		it('should return initiatives', async () => {
			const { ctx } = createMockLoadOptionsFunctions({
				httpResponse: {
					results: [{ id: 'i1', name: 'Q1 Goals' }],
				},
			});

			const result = await getInitiatives.call(ctx);
			expect(result).toEqual([{ name: 'Q1 Goals', value: 'i1' }]);
		});
	});

	describe('getCustomers', () => {
		it('should return customers', async () => {
			const { ctx } = createMockLoadOptionsFunctions({
				httpResponse: {
					results: [
						{ id: 'cu1', name: 'Acme Corp' },
						{ id: 'cu2', name: '', email: 'contact@example.com' },
					],
				},
			});

			const result = await getCustomers.call(ctx);
			expect(result).toEqual([
				{ name: 'Acme Corp', value: 'cu1' },
				{ name: 'contact@example.com', value: 'cu2' },
			]);
		});
	});

	describe('getInitiativeLabels', () => {
		it('should return initiative labels', async () => {
			const { ctx } = createMockLoadOptionsFunctions({
				httpResponse: {
					results: [{ id: 'il1', name: 'Priority' }],
				},
			});

			const result = await getInitiativeLabels.call(ctx);
			expect(result).toEqual([{ name: 'Priority', value: 'il1' }]);
		});
	});

	describe('API response format handling', () => {
		it('should handle array responses', async () => {
			const { ctx } = createMockLoadOptionsFunctions({
				httpResponse: [
					{ id: 'p1', name: 'Project 1', identifier: 'P1' },
				],
			});

			const result = await getProjects.call(ctx);
			expect(result).toEqual([{ name: 'P1 - Project 1', value: 'p1' }]);
		});

		it('should handle empty results', async () => {
			const { ctx } = createMockLoadOptionsFunctions({
				httpResponse: { results: [] },
			});

			const result = await getProjects.call(ctx);
			expect(result).toEqual([]);
		});
	});
});
