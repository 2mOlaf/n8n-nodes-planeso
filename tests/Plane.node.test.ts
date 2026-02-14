import { describe, it, expect } from 'bun:test';
import { Plane } from '../nodes/Plane/Plane.node';
import type { IDataObject, IExecuteFunctions } from 'n8n-workflow';

function createNodeCtx(resource: string, operation: string, params: Record<string, unknown> = {}, httpResponse: unknown = {}) {
	const allParams: Record<string, unknown> = { resource, operation, ...params };
	const requestCalls: IDataObject[] = [];

	const ctx = {
		getNodeParameter(name: string, _index: number, fallback?: unknown) {
			if (name in allParams) return allParams[name];
			if (fallback !== undefined) return fallback;
			throw new Error(`Parameter "${name}" not found`);
		},
		getCredentials: async () => ({
			apiKey: 'test-key',
			workspaceSlug: 'test-ws',
			baseUrl: 'https://api.plane.so',
		}),
		getNode: () => ({ name: 'Plane', type: 'n8n-nodes-planeso.plane' }),
		helpers: {
			httpRequest: async (opts: IDataObject) => {
				requestCalls.push(opts);
				return httpResponse;
			},
			returnJsonArray(data: IDataObject | IDataObject[]) {
				const arr = Array.isArray(data) ? data : [data];
				return arr.map((json) => ({ json }));
			},
		},
	} as unknown as IExecuteFunctions;

	return { ctx, requestCalls };
}

describe('Plane.node', () => {
	const node = new Plane();

	it('should have correct node description', () => {
		expect(node.description.displayName).toBe('Plane');
		expect(node.description.name).toBe('plane');
		expect(node.description.version).toBe(1);
		expect(node.description.usableAsTool).toBe(true);
	});

	it('should list all 31 resources', () => {
		const resourceProp = node.description.properties.find((p) => p.name === 'resource');
		expect(resourceProp).toBeDefined();
		expect(resourceProp!.type).toBe('options');
		expect((resourceProp!.options as IDataObject[])!.length).toBe(31);
	});

	it('should dispatch user.getMe correctly', async () => {
		const { ctx, requestCalls } = createNodeCtx('user', 'getMe');
		const result = await node.execute.call(ctx);

		expect(requestCalls).toHaveLength(1);
		expect(requestCalls[0].url).toBe('/api/v1/users/me/');
		expect(result[0]).toHaveLength(1);
	});

	it('should dispatch project.create correctly', async () => {
		const { ctx, requestCalls } = createNodeCtx('project', 'create', {
			name: 'Test',
			identifier: 'TST',
			additionalFields: {},
		}, { id: 'p1' });

		const result = await node.execute.call(ctx);

		expect(requestCalls[0].method).toBe('POST');
		expect(result[0][0].json).toEqual({ id: 'p1' });
	});

	it('should dispatch workItem.delete correctly', async () => {
		const { ctx, requestCalls } = createNodeCtx('workItem', 'delete', {
			projectId: 'p1',
			workItemId: 'wi1',
		}, '');

		const result = await node.execute.call(ctx);

		expect(requestCalls[0].method).toBe('DELETE');
		expect(result[0]).toHaveLength(1);
	});

	it('should throw for unsupported resource/operation', async () => {
		const { ctx } = createNodeCtx('nonexistent', 'noop');

		await expect(node.execute.call(ctx)).rejects.toThrow('Unsupported operation');
	});

	it('should dispatch customer.linkWorkItems correctly', async () => {
		const { ctx, requestCalls } = createNodeCtx('customer', 'linkWorkItems', {
			customerId: 'c1',
			work_item_ids: 'wi1,wi2',
		}, [{ id: 'wi1' }]);

		const result = await node.execute.call(ctx);

		expect(requestCalls[0].method).toBe('POST');
		expect(result[0]).toHaveLength(1);
	});

	it('should dispatch initiativeLabel.addToInitiative correctly', async () => {
		const { ctx, requestCalls } = createNodeCtx('initiativeLabel', 'addToInitiative', {
			initiativeId: 'init1',
			label_ids: ['l1', 'l2'],
		}, [{ id: 'l1' }]);

		const result = await node.execute.call(ctx);

		expect(requestCalls[0].method).toBe('POST');
		expect(result[0]).toHaveLength(1);
	});
});
