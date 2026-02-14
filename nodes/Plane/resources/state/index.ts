import type { INodeProperties } from 'n8n-workflow';

import { stateCreate, stateCreateDescription } from './create';
import { stateDelete, stateDeleteDescription } from './delete';
import { stateGet, stateGetDescription } from './get';
import { stateGetAll, stateGetAllDescription } from './getAll';
import { stateUpdate, stateUpdateDescription } from './update';

export { stateCreate, stateDelete, stateGet, stateGetAll, stateUpdate };

export const stateDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['state'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a state',
				action: 'Create a state',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete a state',
				action: 'Delete a state',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get a state',
				action: 'Get a state',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Get many states',
				action: 'Get many states',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update a state',
				action: 'Update a state',
			},
		],
		default: 'create',
	},
	...stateCreateDescription,
	...stateDeleteDescription,
	...stateGetDescription,
	...stateGetAllDescription,
	...stateUpdateDescription,
];
