import type { INodeProperties } from 'n8n-workflow';

import { customerRequestCreate, customerRequestCreateDescription } from './create';
import { customerRequestDelete, customerRequestDeleteDescription } from './delete';
import { customerRequestGet, customerRequestGetDescription } from './get';
import { customerRequestGetAll, customerRequestGetAllDescription } from './getAll';
import { customerRequestUpdate, customerRequestUpdateDescription } from './update';

export {
	customerRequestCreate,
	customerRequestDelete,
	customerRequestGet,
	customerRequestGetAll,
	customerRequestUpdate,
};

export const customerRequestDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['customerRequest'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a customer request',
				action: 'Create a customer request',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete a customer request',
				action: 'Delete a customer request',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get a customer request',
				action: 'Get a customer request',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Get many customer requests',
				action: 'Get many customer requests',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update a customer request',
				action: 'Update a customer request',
			},
		],
		default: 'create',
	},
	...customerRequestCreateDescription,
	...customerRequestDeleteDescription,
	...customerRequestGetDescription,
	...customerRequestGetAllDescription,
	...customerRequestUpdateDescription,
];
