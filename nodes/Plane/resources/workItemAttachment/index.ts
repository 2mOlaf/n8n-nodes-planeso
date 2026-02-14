import type { INodeProperties } from 'n8n-workflow';

import { workItemAttachmentGet, workItemAttachmentGetDescription } from './get';
import { workItemAttachmentGetAll, workItemAttachmentGetAllDescription } from './getAll';
import { workItemAttachmentDelete, workItemAttachmentDeleteDescription } from './delete';

export {
	workItemAttachmentGet,
	workItemAttachmentGetAll,
	workItemAttachmentDelete,
};

export const workItemAttachmentDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['workItemAttachment'],
			},
		},
		options: [
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete an attachment from a work item',
				action: 'Delete a work item attachment',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get an attachment from a work item',
				action: 'Get a work item attachment',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Get many attachments on a work item',
				action: 'Get many work item attachments',
			},
		],
		default: 'get',
	},
	...workItemAttachmentGetDescription,
	...workItemAttachmentGetAllDescription,
	...workItemAttachmentDeleteDescription,
];
