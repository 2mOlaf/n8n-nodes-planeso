import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeProperties,
} from 'n8n-workflow';

import { API_ENDPOINTS } from '../../utils/constants';
import { planeRequest, getWorkspaceSlug, rlcValue } from '../../utils/helpers';
import { projectRlc, workItemRlc } from '../../utils/rlcDefs';

const showFor = {
	operation: ['get'],
	resource: ['workItem'],
};

export const workItemGetDescription: INodeProperties[] = [
	projectRlc(showFor),
	workItemRlc(showFor),
];

export async function workItemGet(
	this: IExecuteFunctions,
): Promise<INodeExecutionData[]> {
	const slug = await getWorkspaceSlug(this);
	const projectId = rlcValue(this, 'projectId', 0);
	const workItemId = rlcValue(this, 'workItemId', 0);

	const response = await planeRequest.call(this, {
		method: 'GET',
		url: API_ENDPOINTS.WORK_ITEM(slug, projectId, workItemId),
	});

	return this.helpers.returnJsonArray(Array.isArray(response) ? response : [response]);
}
