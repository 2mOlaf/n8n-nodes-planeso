import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeProperties,
} from 'n8n-workflow';

import { API_ENDPOINTS } from '../../utils/constants';
import { planeRequest, getWorkspaceSlug, rlcValue } from '../../utils/helpers';
import { projectRlc, moduleRlc } from '../../utils/rlcDefs';

const showFor = {
	operation: ['get'],
	resource: ['module'],
};

export const moduleGetDescription: INodeProperties[] = [
	projectRlc(showFor),
	moduleRlc(showFor),
];

export async function moduleGet(
	this: IExecuteFunctions,
): Promise<INodeExecutionData[]> {
	const slug = await getWorkspaceSlug(this);
	const projectId = rlcValue(this, 'projectId', 0);
	const moduleId = rlcValue(this, 'moduleId', 0);

	const response = await planeRequest.call(this, {
		method: 'GET',
		url: API_ENDPOINTS.MODULE(slug, projectId, moduleId),
	});

	return this.helpers.returnJsonArray(Array.isArray(response) ? response : [response]);
}
