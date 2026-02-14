import type { INodeProperties } from 'n8n-workflow';

import { workItemLinkCreate, workItemLinkCreateDescription } from './create';
import { workItemLinkGet, workItemLinkGetDescription } from './get';
import { workItemLinkGetAll, workItemLinkGetAllDescription } from './getAll';
import { workItemLinkUpdate, workItemLinkUpdateDescription } from './update';
import { workItemLinkDelete, workItemLinkDeleteDescription } from './delete';

export {
	workItemLinkCreate,
	workItemLinkGet,
	workItemLinkGetAll,
	workItemLinkUpdate,
	workItemLinkDelete,
};

export const workItemLinkDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['workItemLink'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a link on a work item',
				action: 'Create a work item link',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete a link from a work item',
				action: 'Delete a work item link',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get a link from a work item',
				action: 'Get a work item link',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Get many links on a work item',
				action: 'Get many work item links',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update a link on a work item',
				action: 'Update a work item link',
			},
		],
		default: 'create',
	},
	...workItemLinkCreateDescription,
	...workItemLinkGetDescription,
	...workItemLinkGetAllDescription,
	...workItemLinkUpdateDescription,
	...workItemLinkDeleteDescription,
];
