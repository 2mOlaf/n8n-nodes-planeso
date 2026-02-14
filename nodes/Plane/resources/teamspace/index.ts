import type { INodeProperties } from 'n8n-workflow';

import { teamspaceCreate, teamspaceCreateDescription } from './create';
import { teamspaceDelete, teamspaceDeleteDescription } from './delete';
import { teamspaceGet, teamspaceGetDescription } from './get';
import { teamspaceGetAll, teamspaceGetAllDescription } from './getAll';
import { teamspaceUpdate, teamspaceUpdateDescription } from './update';

export { teamspaceCreate, teamspaceDelete, teamspaceGet, teamspaceGetAll, teamspaceUpdate };

export const teamspaceDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['teamspace'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a teamspace',
				action: 'Create a teamspace',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete a teamspace',
				action: 'Delete a teamspace',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get a teamspace',
				action: 'Get a teamspace',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Get many teamspaces',
				action: 'Get many teamspaces',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update a teamspace',
				action: 'Update a teamspace',
			},
		],
		default: 'create',
	},
	...teamspaceCreateDescription,
	...teamspaceDeleteDescription,
	...teamspaceGetDescription,
	...teamspaceGetAllDescription,
	...teamspaceUpdateDescription,
];
