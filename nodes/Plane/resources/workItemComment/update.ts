import type {
	IDataObject,
	IExecuteFunctions,
	INodeExecutionData,
	INodeProperties,
} from 'n8n-workflow';

import { API_ENDPOINTS } from '../../utils/constants';
import { planeRequest, getWorkspaceSlug } from '../../utils/helpers';

const showFor = {
	operation: ['update'],
	resource: ['workItemComment'],
};

export const workItemCommentUpdateDescription: INodeProperties[] = [
	{
		displayName: 'Project ID',
		name: 'projectId',
		type: 'string',
		default: '',
		required: true,
		description: 'The ID of the project',
		displayOptions: {
			show: showFor,
		},
	},
	{
		displayName: 'Work Item ID',
		name: 'workItemId',
		type: 'string',
		default: '',
		required: true,
		description: 'The ID of the work item',
		displayOptions: {
			show: showFor,
		},
	},
	{
		displayName: 'Comment ID',
		name: 'commentId',
		type: 'string',
		default: '',
		required: true,
		description: 'The ID of the comment to update',
		displayOptions: {
			show: showFor,
		},
	},
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: showFor,
		},
		options: [
			{
				displayName: 'Comment HTML',
				name: 'comment_html',
				type: 'string',
				default: '',
				description: 'The comment content in HTML format',
			},
		],
	},
];

export async function workItemCommentUpdate(
	this: IExecuteFunctions,
): Promise<INodeExecutionData[]> {
	const slug = await getWorkspaceSlug(this);
	const projectId = this.getNodeParameter('projectId', 0) as string;
	const workItemId = this.getNodeParameter('workItemId', 0) as string;
	const commentId = this.getNodeParameter('commentId', 0) as string;
	const updateFields = this.getNodeParameter('updateFields', 0) as IDataObject;

	const body: IDataObject = {};

	if (updateFields.comment_html) {
		body.comment_html = updateFields.comment_html;
	}

	const response = await planeRequest.call(this, {
		method: 'PATCH',
		url: API_ENDPOINTS.WORK_ITEM_COMMENT(slug, projectId, workItemId, commentId),
		body,
	});

	return this.helpers.returnJsonArray(Array.isArray(response) ? response : [response]);
}
