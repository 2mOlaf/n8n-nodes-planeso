import type { INodeProperties } from 'n8n-workflow';

import { timeTrackingCreate, timeTrackingCreateDescription } from './create';
import { timeTrackingDelete, timeTrackingDeleteDescription } from './delete';
import { timeTrackingGetAll, timeTrackingGetAllDescription } from './getAll';
import { timeTrackingUpdate, timeTrackingUpdateDescription } from './update';

export { timeTrackingCreate, timeTrackingDelete, timeTrackingGetAll, timeTrackingUpdate };

export const timeTrackingDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['timeTracking'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a worklog entry',
				action: 'Create a worklog entry',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete a worklog entry',
				action: 'Delete a worklog entry',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Get many worklog entries',
				action: 'Get many worklog entries',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update a worklog entry',
				action: 'Update a worklog entry',
			},
		],
		default: 'create',
	},
	...timeTrackingCreateDescription,
	...timeTrackingDeleteDescription,
	...timeTrackingGetAllDescription,
	...timeTrackingUpdateDescription,
];
