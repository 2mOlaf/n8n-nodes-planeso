import type { INodeProperties } from 'n8n-workflow';

import { cycleCreate, cycleCreateDescription } from './create';
import { cycleDelete, cycleDeleteDescription } from './delete';
import { cycleGet, cycleGetDescription } from './get';
import { cycleGetAll, cycleGetAllDescription } from './getAll';
import { cycleUpdate, cycleUpdateDescription } from './update';

export { cycleCreate, cycleDelete, cycleGet, cycleGetAll, cycleUpdate };

export const cycleDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['cycle'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a cycle',
				action: 'Create a cycle',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete a cycle',
				action: 'Delete a cycle',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get a cycle',
				action: 'Get a cycle',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Get many cycles',
				action: 'Get many cycles',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update a cycle',
				action: 'Update a cycle',
			},
		],
		default: 'create',
	},
	...cycleCreateDescription,
	...cycleDeleteDescription,
	...cycleGetDescription,
	...cycleGetAllDescription,
	...cycleUpdateDescription,
];
