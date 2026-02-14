import type { INodeProperties } from 'n8n-workflow';

import { customPropertyCreate, customPropertyCreateDescription } from './create';
import { customPropertyDelete, customPropertyDeleteDescription } from './delete';
import { customPropertyGet, customPropertyGetDescription } from './get';
import { customPropertyGetAll, customPropertyGetAllDescription } from './getAll';
import { customPropertyUpdate, customPropertyUpdateDescription } from './update';

export {
	customPropertyCreate,
	customPropertyDelete,
	customPropertyGet,
	customPropertyGetAll,
	customPropertyUpdate,
};

export const customPropertyDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['customProperty'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a custom property',
				action: 'Create a custom property',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete a custom property',
				action: 'Delete a custom property',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get a custom property',
				action: 'Get a custom property',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Get many custom properties',
				action: 'Get many custom properties',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update a custom property',
				action: 'Update a custom property',
			},
		],
		default: 'create',
	},
	...customPropertyCreateDescription,
	...customPropertyDeleteDescription,
	...customPropertyGetDescription,
	...customPropertyGetAllDescription,
	...customPropertyUpdateDescription,
];
