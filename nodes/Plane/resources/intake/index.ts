import type { INodeProperties } from 'n8n-workflow';

import { intakeCreate, intakeCreateDescription } from './create';
import { intakeDelete, intakeDeleteDescription } from './delete';
import { intakeGet, intakeGetDescription } from './get';
import { intakeGetAll, intakeGetAllDescription } from './getAll';
import { intakeUpdate, intakeUpdateDescription } from './update';

export { intakeCreate, intakeDelete, intakeGet, intakeGetAll, intakeUpdate };

export const intakeDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['intake'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create an intake issue',
				action: 'Create an intake issue',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete an intake issue',
				action: 'Delete an intake issue',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get an intake issue',
				action: 'Get an intake issue',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Get many intake issues',
				action: 'Get many intake issues',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update an intake issue',
				action: 'Update an intake issue',
			},
		],
		default: 'create',
	},
	...intakeCreateDescription,
	...intakeDeleteDescription,
	...intakeGetDescription,
	...intakeGetAllDescription,
	...intakeUpdateDescription,
];
