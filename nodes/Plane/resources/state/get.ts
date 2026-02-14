import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeProperties,
} from 'n8n-workflow';

import { API_ENDPOINTS } from '../../utils/constants';
import { getWorkspaceSlug, planeRequest, rlcValue } from '../../utils/helpers';
import { projectRlc, stateRlc } from '../../utils/rlcDefs';

const showFor = {
	operation: ['get'],
	resource: ['state'],
};

export const stateGetDescription: INodeProperties[] = [
	projectRlc(showFor),
	stateRlc(showFor),
];

export async function stateGet(
	this: IExecuteFunctions,
): Promise<INodeExecutionData[]> {
	const slug = await getWorkspaceSlug(this);
	const projectId = rlcValue(this, 'projectId', 0);
	const stateId = rlcValue(this, 'stateId', 0);

	const response = await planeRequest.call(this, {
		method: 'GET',
		url: API_ENDPOINTS.STATE(slug, projectId, stateId),
	});

	const results = Array.isArray(response) ? response : [response];
	return this.helpers.returnJsonArray(results);
}
