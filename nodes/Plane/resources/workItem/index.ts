import type { INodeProperties } from 'n8n-workflow';

import { workItemCreate, workItemCreateDescription } from './create';
import { workItemGet, workItemGetDescription } from './get';
import { workItemGetByIdentifier, workItemGetByIdentifierDescription } from './getByIdentifier';
import { workItemGetAll, workItemGetAllDescription } from './getAll';
import { workItemSearch, workItemSearchDescription } from './search';
import { workItemUpdate, workItemUpdateDescription } from './update';
import { workItemDelete, workItemDeleteDescription } from './delete';

export {
	workItemCreate,
	workItemGet,
	workItemGetByIdentifier,
	workItemGetAll,
	workItemSearch,
	workItemUpdate,
	workItemDelete,
};

export const workItemDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['workItem'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a work item',
				action: 'Create a work item',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete a work item',
				action: 'Delete a work item',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get a work item by ID',
				action: 'Get a work item',
			},
			{
				name: 'Get by Identifier',
				value: 'getByIdentifier',
				description: 'Get a work item by its identifier (e.g. PROJECT-123)',
				action: 'Get a work item by identifier',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Get many work items in a project',
				action: 'Get many work items',
			},
			{
				name: 'Search',
				value: 'search',
				description: 'Search for work items across the workspace',
				action: 'Search work items',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update a work item',
				action: 'Update a work item',
			},
		],
		default: 'create',
	},
	...workItemCreateDescription,
	...workItemGetDescription,
	...workItemGetByIdentifierDescription,
	...workItemGetAllDescription,
	...workItemSearchDescription,
	...workItemUpdateDescription,
	...workItemDeleteDescription,
];
