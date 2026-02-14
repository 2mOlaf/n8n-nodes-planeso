import type { INodeProperties } from 'n8n-workflow';

import { customerPropertyCreate, customerPropertyCreateDescription } from './create';
import { customerPropertyDelete, customerPropertyDeleteDescription } from './delete';
import { customerPropertyGet, customerPropertyGetDescription } from './get';
import { customerPropertyGetAll, customerPropertyGetAllDescription } from './getAll';
import { customerPropertyUpdate, customerPropertyUpdateDescription } from './update';

export {
	customerPropertyCreate,
	customerPropertyDelete,
	customerPropertyGet,
	customerPropertyGetAll,
	customerPropertyUpdate,
};

export const customerPropertyDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['customerProperty'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a customer property',
				action: 'Create a customer property',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete a customer property',
				action: 'Delete a customer property',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get a customer property',
				action: 'Get a customer property',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Get many customer properties',
				action: 'Get many customer properties',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update a customer property',
				action: 'Update a customer property',
			},
		],
		default: 'create',
	},
	...customerPropertyCreateDescription,
	...customerPropertyDeleteDescription,
	...customerPropertyGetDescription,
	...customerPropertyGetAllDescription,
	...customerPropertyUpdateDescription,
];
