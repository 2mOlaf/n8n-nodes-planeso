import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeProperties,
} from 'n8n-workflow';

import { API_ENDPOINTS } from '../../utils/constants';
import { planeRequest, getWorkspaceSlug, rlcValue } from '../../utils/helpers';
import { projectRlc, workItemRlc, workItemLinkRlc } from '../../utils/rlcDefs';

const showFor = {
	operation: ['delete'],
	resource: ['workItemLink'],
};

export const workItemLinkDeleteDescription: INodeProperties[] = [
	projectRlc(showFor),
	workItemRlc(showFor),
	workItemLinkRlc(showFor),
];

export async function workItemLinkDelete(
	this: IExecuteFunctions,
): Promise<INodeExecutionData[]> {
	const slug = await getWorkspaceSlug(this);
	const projectId = rlcValue(this, 'projectId', 0);
	const workItemId = rlcValue(this, 'workItemId', 0);
	const linkId = rlcValue(this, 'linkId', 0);

	const response = await planeRequest.call(this, {
		method: 'DELETE',
		url: API_ENDPOINTS.WORK_ITEM_LINK(slug, projectId, workItemId, linkId),
	});

	return this.helpers.returnJsonArray(Array.isArray(response) ? response : [response]);
}
