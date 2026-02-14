import type { INodeProperties } from 'n8n-workflow';

import { initiativeProjectAdd, initiativeProjectAddDescription } from './add';
import { initiativeProjectGetAll, initiativeProjectGetAllDescription } from './getAll';
import { initiativeProjectRemove, initiativeProjectRemoveDescription } from './remove';

export { initiativeProjectAdd, initiativeProjectGetAll, initiativeProjectRemove };

export const initiativeProjectDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['initiativeProject'],
			},
		},
		options: [
			{
				name: 'Add',
				value: 'add',
				description: 'Add projects to an initiative',
				action: 'Add projects to an initiative',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Get many projects for an initiative',
				action: 'Get many projects for an initiative',
			},
			{
				name: 'Remove',
				value: 'remove',
				description: 'Remove projects from an initiative',
				action: 'Remove projects from an initiative',
			},
		],
		default: 'add',
	},
	...initiativeProjectAddDescription,
	...initiativeProjectGetAllDescription,
	...initiativeProjectRemoveDescription,
];
