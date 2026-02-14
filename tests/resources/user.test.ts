import { describe, it, expect } from 'bun:test';
import { userGetMe } from '../../nodes/Plane/resources/user';
import { createMockExecuteFunctions } from '../helpers/mockExecuteFunctions';

describe('User', () => {
	describe('getMe', () => {
		it('should call GET /api/v1/users/me/', async () => {
			const mockUser = { id: 'u1', email: 'test@example.com' };
			const { ctx, requestCalls } = createMockExecuteFunctions({
				httpResponse: mockUser,
			});

			const result = await userGetMe.call(ctx);

			expect(requestCalls).toHaveLength(1);
			expect(requestCalls[0].method).toBe('GET');
			expect(requestCalls[0].url).toBe('/api/v1/users/me/');
			expect(result[0].json).toEqual(mockUser);
		});

		it('should wrap array response', async () => {
			const mockUsers = [{ id: 'u1' }];
			const { ctx } = createMockExecuteFunctions({
				httpResponse: mockUsers,
			});

			const result = await userGetMe.call(ctx);

			expect(result[0].json).toEqual({ id: 'u1' });
		});
	});
});
