import type { INodeProperties } from 'n8n-workflow';

import { stickyCreate, stickyCreateDescription } from './create';
import { stickyDelete, stickyDeleteDescription } from './delete';
import { stickyGet, stickyGetDescription } from './get';
import { stickyGetAll, stickyGetAllDescription } from './getAll';
import { stickyUpdate, stickyUpdateDescription } from './update';

export { stickyCreate, stickyDelete, stickyGet, stickyGetAll, stickyUpdate };

export const stickyDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['sticky'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a sticky',
				action: 'Create a sticky',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete a sticky',
				action: 'Delete a sticky',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get a sticky',
				action: 'Get a sticky',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Get many stickies',
				action: 'Get many stickies',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update a sticky',
				action: 'Update a sticky',
			},
		],
		default: 'create',
	},
	...stickyCreateDescription,
	...stickyDeleteDescription,
	...stickyGetDescription,
	...stickyGetAllDescription,
	...stickyUpdateDescription,
];
