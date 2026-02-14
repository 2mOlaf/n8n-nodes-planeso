import type { INodeProperties } from 'n8n-workflow';

import { epicGet, epicGetDescription } from './get';
import { epicGetAll, epicGetAllDescription } from './getAll';

export { epicGet, epicGetAll };

export const epicDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['epic'],
			},
		},
		options: [
			{
				name: 'Get',
				value: 'get',
				description: 'Get an epic',
				action: 'Get an epic',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Get many epics',
				action: 'Get many epics',
			},
		],
		default: 'get',
	},
	...epicGetDescription,
	...epicGetAllDescription,
];
