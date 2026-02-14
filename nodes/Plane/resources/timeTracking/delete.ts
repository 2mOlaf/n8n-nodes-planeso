import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeProperties,
} from 'n8n-workflow';

import { API_ENDPOINTS } from '../../utils/constants';
import { planeRequest, getWorkspaceSlug, rlcValue } from '../../utils/helpers';
import { projectRlc, workItemRlc, timeTrackingRlc } from '../../utils/rlcDefs';

const showFor = {
	operation: ['delete'],
	resource: ['timeTracking'],
};

export const timeTrackingDeleteDescription: INodeProperties[] = [
	projectRlc(showFor),
	workItemRlc(showFor),
	timeTrackingRlc(showFor),
];

export async function timeTrackingDelete(
	this: IExecuteFunctions,
): Promise<INodeExecutionData[]> {
	const slug = await getWorkspaceSlug(this);
	const projectId = rlcValue(this, 'projectId', 0);
	const workItemId = rlcValue(this, 'workItemId', 0);
	const worklogId = rlcValue(this, 'worklogId', 0);

	await planeRequest.call(this, {
		method: 'DELETE',
		url: API_ENDPOINTS.WORKLOG(slug, projectId, workItemId, worklogId),
	});

	return this.helpers.returnJsonArray([{ success: true }]);
}
