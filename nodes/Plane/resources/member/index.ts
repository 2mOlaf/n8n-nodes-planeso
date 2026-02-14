import type { INodeProperties } from 'n8n-workflow';

import { memberGetAll, memberGetAllDescription } from './getAll';

export { memberGetAll };

export const memberDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['member'],
			},
		},
		options: [
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Get many members',
				action: 'Get many members',
			},
		],
		default: 'getAll',
	},
	...memberGetAllDescription,
];
