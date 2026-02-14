import type { INodeProperties } from 'n8n-workflow';

import { workItemActivityGet, workItemActivityGetDescription } from './get';
import { workItemActivityGetAll, workItemActivityGetAllDescription } from './getAll';

export {
	workItemActivityGet,
	workItemActivityGetAll,
};

export const workItemActivityDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['workItemActivity'],
			},
		},
		options: [
			{
				name: 'Get',
				value: 'get',
				description: 'Get an activity entry from a work item',
				action: 'Get a work item activity',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Get many activity entries from a work item',
				action: 'Get many work item activities',
			},
		],
		default: 'get',
	},
	...workItemActivityGetDescription,
	...workItemActivityGetAllDescription,
];
