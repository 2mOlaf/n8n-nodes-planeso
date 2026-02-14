import type { INodeProperties } from 'n8n-workflow';

import { labelCreate, labelCreateDescription } from './create';
import { labelDelete, labelDeleteDescription } from './delete';
import { labelGet, labelGetDescription } from './get';
import { labelGetAll, labelGetAllDescription } from './getAll';
import { labelUpdate, labelUpdateDescription } from './update';

export { labelCreate, labelDelete, labelGet, labelGetAll, labelUpdate };

export const labelDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['label'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a label',
				action: 'Create a label',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete a label',
				action: 'Delete a label',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get a label',
				action: 'Get a label',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Get many labels',
				action: 'Get many labels',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update a label',
				action: 'Update a label',
			},
		],
		default: 'create',
	},
	...labelCreateDescription,
	...labelDeleteDescription,
	...labelGetDescription,
	...labelGetAllDescription,
	...labelUpdateDescription,
];
