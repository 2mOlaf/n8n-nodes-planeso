import type { INodeProperties } from 'n8n-workflow';

import { customerCreate, customerCreateDescription } from './create';
import { customerDelete, customerDeleteDescription } from './delete';
import { customerGet, customerGetDescription } from './get';
import { customerGetAll, customerGetAllDescription } from './getAll';
import { customerGetWorkItems, customerGetWorkItemsDescription } from './getWorkItems';
import { customerLinkWorkItems, customerLinkWorkItemsDescription } from './linkWorkItems';
import { customerUnlinkWorkItem, customerUnlinkWorkItemDescription } from './unlinkWorkItem';
import { customerUpdate, customerUpdateDescription } from './update';

export {
	customerCreate,
	customerDelete,
	customerGet,
	customerGetAll,
	customerGetWorkItems,
	customerLinkWorkItems,
	customerUnlinkWorkItem,
	customerUpdate,
};

export const customerDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['customer'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a customer',
				action: 'Create a customer',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete a customer',
				action: 'Delete a customer',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get a customer',
				action: 'Get a customer',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Get many customers',
				action: 'Get many customers',
			},
			{
				name: 'Get Work Items',
				value: 'getWorkItems',
				description: 'Get work items linked to a customer',
				action: 'Get work items linked to a customer',
			},
			{
				name: 'Link Work Items',
				value: 'linkWorkItems',
				description: 'Link work items to a customer',
				action: 'Link work items to a customer',
			},
			{
				name: 'Unlink Work Item',
				value: 'unlinkWorkItem',
				description: 'Unlink a work item from a customer',
				action: 'Unlink a work item from a customer',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update a customer',
				action: 'Update a customer',
			},
		],
		default: 'create',
	},
	...customerCreateDescription,
	...customerDeleteDescription,
	...customerGetDescription,
	...customerGetAllDescription,
	...customerGetWorkItemsDescription,
	...customerLinkWorkItemsDescription,
	...customerUnlinkWorkItemDescription,
	...customerUpdateDescription,
];
