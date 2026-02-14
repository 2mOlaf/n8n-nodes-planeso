import type { INodeProperties } from 'n8n-workflow';

import { userGetMe, userGetMeDescription } from './getMe';

export { userGetMe };

export const userDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['user'],
			},
		},
		options: [
			{
				name: 'Get Me',
				value: 'getMe',
				description: 'Get the currently authenticated user',
				action: 'Get the currently authenticated user',
			},
		],
		default: 'getMe',
	},
	...userGetMeDescription,
];
