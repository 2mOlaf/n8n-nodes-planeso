import type { INodeProperties } from 'n8n-workflow';

import { teamspaceMemberAdd, teamspaceMemberAddDescription } from './add';
import { teamspaceMemberGetAll, teamspaceMemberGetAllDescription } from './getAll';
import { teamspaceMemberRemove, teamspaceMemberRemoveDescription } from './remove';

export { teamspaceMemberAdd, teamspaceMemberGetAll, teamspaceMemberRemove };

export const teamspaceMemberDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['teamspaceMember'],
			},
		},
		options: [
			{
				name: 'Add',
				value: 'add',
				description: 'Add members to a teamspace',
				action: 'Add members to a teamspace',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Get many teamspace members',
				action: 'Get many teamspace members',
			},
			{
				name: 'Remove',
				value: 'remove',
				description: 'Remove members from a teamspace',
				action: 'Remove members from a teamspace',
			},
		],
		default: 'add',
	},
	...teamspaceMemberAddDescription,
	...teamspaceMemberGetAllDescription,
	...teamspaceMemberRemoveDescription,
];
