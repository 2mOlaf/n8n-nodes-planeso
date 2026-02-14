import { describe, it, expect } from 'bun:test';
import {
	initiativeLabelCreate,
	initiativeLabelGet,
	initiativeLabelGetAll,
	initiativeLabelUpdate,
	initiativeLabelDelete,
	initiativeLabelAddToInitiative,
	initiativeLabelRemoveFromInitiative,
	initiativeLabelGetAllForInitiative,
} from '../../nodes/Plane/resources/initiativeLabel';
import { createMockExecuteFunctions } from '../helpers/mockExecuteFunctions';

const BASE = '/api/v1/workspaces/test-workspace/initiatives/labels';

describe('InitiativeLabel', () => {
	describe('create', () => {
		it('should POST with required fields', async () => {
			const { ctx, requestCalls } = createMockExecuteFunctions({
				nodeParameters: { name: 'Priority', additionalFields: {} },
				httpResponse: { id: 'il1', name: 'Priority' },
			});

			const result = await initiativeLabelCreate.call(ctx);

			expect(requestCalls[0].method).toBe('POST');
			expect(requestCalls[0].url).toBe(`${BASE}/`);
			expect(requestCalls[0].body).toEqual({ name: 'Priority' });
			expect(result[0].json.id).toBe('il1');
		});
	});

	describe('get', () => {
		it('should GET by label ID', async () => {
			const { ctx, requestCalls } = createMockExecuteFunctions({
				nodeParameters: { labelId: 'il1' },
				httpResponse: { id: 'il1' },
			});

			const result = await initiativeLabelGet.call(ctx);

			expect(requestCalls[0].method).toBe('GET');
			expect(requestCalls[0].url).toBe(`${BASE}/il1/`);
			expect(result[0].json.id).toBe('il1');
		});
	});

	describe('getAll', () => {
		it('should GET all initiative labels', async () => {
			const { ctx, requestCalls } = createMockExecuteFunctions({
				nodeParameters: { returnAll: false, limit: 50 },
				httpResponse: [{ id: 'il1' }],
			});

			const result = await initiativeLabelGetAll.call(ctx);

			expect(requestCalls[0].method).toBe('GET');
			expect(requestCalls[0].url).toBe(`${BASE}/`);
			expect(result).toHaveLength(1);
		});
	});

	describe('update', () => {
		it('should PATCH with update fields', async () => {
			const { ctx, requestCalls } = createMockExecuteFunctions({
				nodeParameters: { labelId: 'il1', updateFields: { name: 'Urgent' } },
				httpResponse: { id: 'il1', name: 'Urgent' },
			});

			const result = await initiativeLabelUpdate.call(ctx);

			expect(requestCalls[0].method).toBe('PATCH');
			expect(requestCalls[0].url).toBe(`${BASE}/il1/`);
			expect(result[0].json.name).toBe('Urgent');
		});
	});

	describe('delete', () => {
		it('should DELETE by label ID', async () => {
			const { ctx, requestCalls } = createMockExecuteFunctions({
				nodeParameters: { labelId: 'il1' },
				httpResponse: undefined,
			});

			const result = await initiativeLabelDelete.call(ctx);

			expect(requestCalls[0].method).toBe('DELETE');
			expect(requestCalls[0].url).toBe(`${BASE}/il1/`);
			expect(result[0].json).toEqual({ success: true });
		});
	});

	describe('addToInitiative', () => {
		it('should POST label IDs to initiative', async () => {
			const { ctx, requestCalls } = createMockExecuteFunctions({
				nodeParameters: { initiativeId: 'init1', label_ids: 'il1,il2' },
				httpResponse: [{ id: 'il1' }, { id: 'il2' }],
			});

			const result = await initiativeLabelAddToInitiative.call(ctx);

			expect(requestCalls[0].method).toBe('POST');
			expect(requestCalls[0].url).toBe('/api/v1/workspaces/test-workspace/initiatives/init1/labels/');
			expect(requestCalls[0].body).toEqual({ label_ids: ['il1', 'il2'] });
			expect(result).toHaveLength(2);
		});
	});

	describe('removeFromInitiative', () => {
		it('should DELETE label IDs from initiative', async () => {
			const { ctx, requestCalls } = createMockExecuteFunctions({
				nodeParameters: { initiativeId: 'init1', label_ids: 'il1,il2' },
				httpResponse: undefined,
			});

			const result = await initiativeLabelRemoveFromInitiative.call(ctx);

			expect(requestCalls[0].method).toBe('DELETE');
			expect(requestCalls[0].url).toBe('/api/v1/workspaces/test-workspace/initiatives/init1/labels/');
			expect(requestCalls[0].body).toEqual({ label_ids: ['il1', 'il2'] });
			expect(result[0].json).toEqual({ success: true });
		});
	});

	describe('getAllForInitiative', () => {
		it('should GET all labels for a specific initiative', async () => {
			const { ctx, requestCalls } = createMockExecuteFunctions({
				nodeParameters: { initiativeId: 'init1', returnAll: false, limit: 50 },
				httpResponse: [{ id: 'il1' }],
			});

			const result = await initiativeLabelGetAllForInitiative.call(ctx);

			expect(requestCalls[0].method).toBe('GET');
			expect(requestCalls[0].url).toBe('/api/v1/workspaces/test-workspace/initiatives/init1/labels/');
			expect(result).toHaveLength(1);
		});
	});
});
