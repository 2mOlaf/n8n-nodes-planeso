import type { INodeProperties } from 'n8n-workflow';

import { pageCreate, pageCreateDescription } from './create';
import { pageGet, pageGetDescription } from './get';

export { pageCreate, pageGet };

export const pageDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['page'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a page',
				action: 'Create a page',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get a page',
				action: 'Get a page',
			},
		],
		default: 'create',
	},
	...pageCreateDescription,
	...pageGetDescription,
];
