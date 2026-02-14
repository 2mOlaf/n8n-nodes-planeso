import type { INodeProperties } from 'n8n-workflow';

import { teamspaceProjectAdd, teamspaceProjectAddDescription } from './add';
import { teamspaceProjectGetAll, teamspaceProjectGetAllDescription } from './getAll';
import { teamspaceProjectRemove, teamspaceProjectRemoveDescription } from './remove';

export { teamspaceProjectAdd, teamspaceProjectGetAll, teamspaceProjectRemove };

export const teamspaceProjectDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['teamspaceProject'],
			},
		},
		options: [
			{
				name: 'Add',
				value: 'add',
				description: 'Add projects to a teamspace',
				action: 'Add projects to a teamspace',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Get many teamspace projects',
				action: 'Get many teamspace projects',
			},
			{
				name: 'Remove',
				value: 'remove',
				description: 'Remove projects from a teamspace',
				action: 'Remove projects from a teamspace',
			},
		],
		default: 'add',
	},
	...teamspaceProjectAddDescription,
	...teamspaceProjectGetAllDescription,
	...teamspaceProjectRemoveDescription,
];
