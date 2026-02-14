import type { INodeProperties } from 'n8n-workflow';

import { projectCreate, projectCreateDescription } from './create';
import { projectDelete, projectDeleteDescription } from './delete';
import { projectGet, projectGetDescription } from './get';
import { projectGetAll, projectGetAllDescription } from './getAll';
import { projectUpdate, projectUpdateDescription } from './update';

export { projectCreate, projectDelete, projectGet, projectGetAll, projectUpdate };

export const projectDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['project'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a project',
				action: 'Create a project',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete a project',
				action: 'Delete a project',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get a project',
				action: 'Get a project',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Get many projects',
				action: 'Get many projects',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update a project',
				action: 'Update a project',
			},
		],
		default: 'create',
	},
	...projectCreateDescription,
	...projectDeleteDescription,
	...projectGetDescription,
	...projectGetAllDescription,
	...projectUpdateDescription,
];
