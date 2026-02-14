import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeProperties,
} from 'n8n-workflow';

import { API_ENDPOINTS } from '../../utils/constants';
import { planeRequest, getWorkspaceSlug, rlcValue } from '../../utils/helpers';
import { projectRlc, workItemRlc, workItemAttachmentRlc } from '../../utils/rlcDefs';

const showFor = {
	operation: ['get'],
	resource: ['workItemAttachment'],
};

export const workItemAttachmentGetDescription: INodeProperties[] = [
	projectRlc(showFor),
	workItemRlc(showFor),
	workItemAttachmentRlc(showFor),
];

export async function workItemAttachmentGet(
	this: IExecuteFunctions,
): Promise<INodeExecutionData[]> {
	const slug = await getWorkspaceSlug(this);
	const projectId = rlcValue(this, 'projectId', 0);
	const workItemId = rlcValue(this, 'workItemId', 0);
	const attachmentId = rlcValue(this, 'attachmentId', 0);

	const response = await planeRequest.call(this, {
		method: 'GET',
		url: API_ENDPOINTS.WORK_ITEM_ATTACHMENT(slug, projectId, workItemId, attachmentId),
	});

	return this.helpers.returnJsonArray(Array.isArray(response) ? response : [response]);
}
