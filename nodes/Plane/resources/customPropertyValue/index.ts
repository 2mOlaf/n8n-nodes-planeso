import type { INodeProperties } from 'n8n-workflow';

import { customPropertyValueGetAll, customPropertyValueGetAllDescription } from './getAll';
import { customPropertyValueUpdate, customPropertyValueUpdateDescription } from './update';

export { customPropertyValueGetAll, customPropertyValueUpdate };

export const customPropertyValueDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['customPropertyValue'],
			},
		},
		options: [
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Get many custom property values for a work item',
				action: 'Get many custom property values',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update a custom property value for a work item',
				action: 'Update a custom property value',
			},
		],
		default: 'getAll',
	},
	...customPropertyValueGetAllDescription,
	...customPropertyValueUpdateDescription,
];
