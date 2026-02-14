import type { INodeProperties } from 'n8n-workflow';

import { initiativeEpicAdd, initiativeEpicAddDescription } from './add';
import { initiativeEpicGetAll, initiativeEpicGetAllDescription } from './getAll';
import { initiativeEpicRemove, initiativeEpicRemoveDescription } from './remove';

export { initiativeEpicAdd, initiativeEpicGetAll, initiativeEpicRemove };

export const initiativeEpicDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['initiativeEpic'],
			},
		},
		options: [
			{
				name: 'Add',
				value: 'add',
				description: 'Add epics to an initiative',
				action: 'Add epics to an initiative',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Get many epics for an initiative',
				action: 'Get many epics for an initiative',
			},
			{
				name: 'Remove',
				value: 'remove',
				description: 'Remove epics from an initiative',
				action: 'Remove epics from an initiative',
			},
		],
		default: 'add',
	},
	...initiativeEpicAddDescription,
	...initiativeEpicGetAllDescription,
	...initiativeEpicRemoveDescription,
];
