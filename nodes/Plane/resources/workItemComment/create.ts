import type {
	IDataObject,
	IExecuteFunctions,
	INodeExecutionData,
	INodeProperties,
} from 'n8n-workflow';

import { API_ENDPOINTS } from '../../utils/constants';
import { planeRequest, getWorkspaceSlug, rlcValue } from '../../utils/helpers';
import { projectRlc, workItemRlc } from '../../utils/rlcDefs';

const showFor = {
	operation: ['create'],
	resource: ['workItemComment'],
};

export const workItemCommentCreateDescription: INodeProperties[] = [
	projectRlc(showFor),
	workItemRlc(showFor),
	{
		displayName: 'Comment HTML',
		name: 'comment_html',
		type: 'string',
		default: '',
		required: true,
		description: 'The comment content in HTML format',
		displayOptions: {
			show: showFor,
		},
	},
];

export async function workItemCommentCreate(
	this: IExecuteFunctions,
): Promise<INodeExecutionData[]> {
	const slug = await getWorkspaceSlug(this);
	const projectId = rlcValue(this, 'projectId', 0);
	const workItemId = rlcValue(this, 'workItemId', 0);
	const comment_html = this.getNodeParameter('comment_html', 0) as string;

	const body: IDataObject = {
		comment_html,
	};

	const response = await planeRequest.call(this, {
		method: 'POST',
		url: API_ENDPOINTS.WORK_ITEM_COMMENTS(slug, projectId, workItemId),
		body,
	});

	return this.helpers.returnJsonArray(Array.isArray(response) ? response : [response]);
}
