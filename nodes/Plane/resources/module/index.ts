import type { INodeProperties } from 'n8n-workflow';

import { moduleCreate, moduleCreateDescription } from './create';
import { moduleDelete, moduleDeleteDescription } from './delete';
import { moduleGet, moduleGetDescription } from './get';
import { moduleGetAll, moduleGetAllDescription } from './getAll';
import { moduleUpdate, moduleUpdateDescription } from './update';

export { moduleCreate, moduleDelete, moduleGet, moduleGetAll, moduleUpdate };

export const moduleDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['module'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a module',
				action: 'Create a module',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete a module',
				action: 'Delete a module',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get a module',
				action: 'Get a module',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Get many modules',
				action: 'Get many modules',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update a module',
				action: 'Update a module',
			},
		],
		default: 'create',
	},
	...moduleCreateDescription,
	...moduleDeleteDescription,
	...moduleGetDescription,
	...moduleGetAllDescription,
	...moduleUpdateDescription,
];
