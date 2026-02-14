import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeProperties,
} from 'n8n-workflow';

import { API_ENDPOINTS } from '../../utils/constants';
import { getWorkspaceSlug, planeRequest, rlcValue } from '../../utils/helpers';
import { projectRlc, labelRlc } from '../../utils/rlcDefs';

const showFor = {
	operation: ['get'],
	resource: ['label'],
};

export const labelGetDescription: INodeProperties[] = [
	projectRlc(showFor),
	labelRlc(showFor),
];

export async function labelGet(
	this: IExecuteFunctions,
): Promise<INodeExecutionData[]> {
	const slug = await getWorkspaceSlug(this);
	const projectId = rlcValue(this, 'projectId', 0);
	const labelId = rlcValue(this, 'labelId', 0);

	const response = await planeRequest.call(this, {
		method: 'GET',
		url: API_ENDPOINTS.LABEL(slug, projectId, labelId),
	});

	const results = Array.isArray(response) ? response : [response];
	return this.helpers.returnJsonArray(results);
}
