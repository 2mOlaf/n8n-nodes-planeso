import type { INodeProperties } from 'n8n-workflow';

import { initiativeCreate, initiativeCreateDescription } from './create';
import { initiativeDelete, initiativeDeleteDescription } from './delete';
import { initiativeGet, initiativeGetDescription } from './get';
import { initiativeGetAll, initiativeGetAllDescription } from './getAll';
import { initiativeUpdate, initiativeUpdateDescription } from './update';

export { initiativeCreate, initiativeDelete, initiativeGet, initiativeGetAll, initiativeUpdate };

export const initiativeDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['initiative'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create an initiative',
				action: 'Create an initiative',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete an initiative',
				action: 'Delete an initiative',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get an initiative',
				action: 'Get an initiative',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Get many initiatives',
				action: 'Get many initiatives',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update an initiative',
				action: 'Update an initiative',
			},
		],
		default: 'create',
	},
	...initiativeCreateDescription,
	...initiativeDeleteDescription,
	...initiativeGetDescription,
	...initiativeGetAllDescription,
	...initiativeUpdateDescription,
];
