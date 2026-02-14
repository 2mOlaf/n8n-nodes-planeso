import type { INodeProperties } from 'n8n-workflow';

import { workItemTypeCreate, workItemTypeCreateDescription } from './create';
import { workItemTypeGet, workItemTypeGetDescription } from './get';
import { workItemTypeGetAll, workItemTypeGetAllDescription } from './getAll';
import { workItemTypeUpdate, workItemTypeUpdateDescription } from './update';
import { workItemTypeDelete, workItemTypeDeleteDescription } from './delete';

export {
	workItemTypeCreate,
	workItemTypeGet,
	workItemTypeGetAll,
	workItemTypeUpdate,
	workItemTypeDelete,
};

export const workItemTypeDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['workItemType'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a work item type',
				action: 'Create a work item type',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete a work item type',
				action: 'Delete a work item type',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get a work item type',
				action: 'Get a work item type',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Get many work item types in a project',
				action: 'Get many work item types',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update a work item type',
				action: 'Update a work item type',
			},
		],
		default: 'create',
	},
	...workItemTypeCreateDescription,
	...workItemTypeGetDescription,
	...workItemTypeGetAllDescription,
	...workItemTypeUpdateDescription,
	...workItemTypeDeleteDescription,
];
