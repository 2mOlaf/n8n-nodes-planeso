import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeProperties,
} from 'n8n-workflow';

import { API_ENDPOINTS } from '../../utils/constants';
import { planeRequest, getWorkspaceSlug, rlcValue } from '../../utils/helpers';
import { projectRlc, workItemRlc, workItemCommentRlc } from '../../utils/rlcDefs';

const showFor = {
	operation: ['delete'],
	resource: ['workItemComment'],
};

export const workItemCommentDeleteDescription: INodeProperties[] = [
	projectRlc(showFor),
	workItemRlc(showFor),
	workItemCommentRlc(showFor),
];

export async function workItemCommentDelete(
	this: IExecuteFunctions,
): Promise<INodeExecutionData[]> {
	const slug = await getWorkspaceSlug(this);
	const projectId = rlcValue(this, 'projectId', 0);
	const workItemId = rlcValue(this, 'workItemId', 0);
	const commentId = rlcValue(this, 'commentId', 0);

	await planeRequest.call(this, {
		method: 'DELETE',
		url: API_ENDPOINTS.WORK_ITEM_COMMENT(slug, projectId, workItemId, commentId),
	});

	return this.helpers.returnJsonArray([{ success: true }]);
}
