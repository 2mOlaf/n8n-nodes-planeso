import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeProperties,
} from 'n8n-workflow';

import { API_ENDPOINTS } from '../../utils/constants';
import { planeRequest, getWorkspaceSlug, rlcValue } from '../../utils/helpers';
import { projectRlc, cycleRlc } from '../../utils/rlcDefs';

const showFor = {
	operation: ['get'],
	resource: ['cycle'],
};

export const cycleGetDescription: INodeProperties[] = [
	projectRlc(showFor),
	cycleRlc(showFor),
];

export async function cycleGet(
	this: IExecuteFunctions,
): Promise<INodeExecutionData[]> {
	const slug = await getWorkspaceSlug(this);
	const projectId = rlcValue(this, 'projectId', 0);
	const cycleId = rlcValue(this, 'cycleId', 0);

	const response = await planeRequest.call(this, {
		method: 'GET',
		url: API_ENDPOINTS.CYCLE(slug, projectId, cycleId),
	});

	return this.helpers.returnJsonArray(Array.isArray(response) ? response : [response]);
}
