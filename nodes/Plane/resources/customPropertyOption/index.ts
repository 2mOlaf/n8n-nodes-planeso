import type { INodeProperties } from 'n8n-workflow';

import { customPropertyOptionCreate, customPropertyOptionCreateDescription } from './create';
import { customPropertyOptionDelete, customPropertyOptionDeleteDescription } from './delete';
import { customPropertyOptionGet, customPropertyOptionGetDescription } from './get';
import { customPropertyOptionGetAll, customPropertyOptionGetAllDescription } from './getAll';
import { customPropertyOptionUpdate, customPropertyOptionUpdateDescription } from './update';

export {
	customPropertyOptionCreate,
	customPropertyOptionDelete,
	customPropertyOptionGet,
	customPropertyOptionGetAll,
	customPropertyOptionUpdate,
};

export const customPropertyOptionDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['customPropertyOption'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a custom property option',
				action: 'Create a custom property option',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete a custom property option',
				action: 'Delete a custom property option',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get a custom property option',
				action: 'Get a custom property option',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Get many custom property options',
				action: 'Get many custom property options',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update a custom property option',
				action: 'Update a custom property option',
			},
		],
		default: 'create',
	},
	...customPropertyOptionCreateDescription,
	...customPropertyOptionDeleteDescription,
	...customPropertyOptionGetDescription,
	...customPropertyOptionGetAllDescription,
	...customPropertyOptionUpdateDescription,
];
