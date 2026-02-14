import type {
	IDataObject,
	IExecuteFunctions,
	INodeExecutionData,
	INodeProperties,
} from 'n8n-workflow';

import { API_ENDPOINTS } from '../../utils/constants';
import { planeRequest, getWorkspaceSlug, rlcValue } from '../../utils/helpers';
import { projectRlc, workItemRlc, workItemCommentRlc } from '../../utils/rlcDefs';

const showFor = {
	operation: ['update'],
	resource: ['workItemComment'],
};

export const workItemCommentUpdateDescription: INodeProperties[] = [
	projectRlc(showFor),
	workItemRlc(showFor),
	workItemCommentRlc(showFor),
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
	const projectId = rlcValue(this, 'projectId', 0);
	const workItemId = rlcValue(this, 'workItemId', 0);
	const commentId = rlcValue(this, 'commentId', 0);
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
