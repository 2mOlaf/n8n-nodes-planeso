import type { INodeProperties } from 'n8n-workflow';

import { workItemCommentCreate, workItemCommentCreateDescription } from './create';
import { workItemCommentGet, workItemCommentGetDescription } from './get';
import { workItemCommentGetAll, workItemCommentGetAllDescription } from './getAll';
import { workItemCommentUpdate, workItemCommentUpdateDescription } from './update';
import { workItemCommentDelete, workItemCommentDeleteDescription } from './delete';

export {
	workItemCommentCreate,
	workItemCommentGet,
	workItemCommentGetAll,
	workItemCommentUpdate,
	workItemCommentDelete,
};

export const workItemCommentDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['workItemComment'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a comment on a work item',
				action: 'Create a work item comment',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete a comment from a work item',
				action: 'Delete a work item comment',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get a comment from a work item',
				action: 'Get a work item comment',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Get many comments on a work item',
				action: 'Get many work item comments',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update a comment on a work item',
				action: 'Update a work item comment',
			},
		],
		default: 'create',
	},
	...workItemCommentCreateDescription,
	...workItemCommentGetDescription,
	...workItemCommentGetAllDescription,
	...workItemCommentUpdateDescription,
	...workItemCommentDeleteDescription,
];
