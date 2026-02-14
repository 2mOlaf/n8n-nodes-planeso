import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeProperties,
} from 'n8n-workflow';

import { API_ENDPOINTS } from '../../utils/constants';
import { planeRequest, getWorkspaceSlug, rlcValue } from '../../utils/helpers';
import { projectRlc, epicRlc } from '../../utils/rlcDefs';

const showFor = {
	operation: ['get'],
	resource: ['epic'],
};

export const epicGetDescription: INodeProperties[] = [
	projectRlc(showFor),
	epicRlc(showFor),
];

export async function epicGet(
	this: IExecuteFunctions,
): Promise<INodeExecutionData[]> {
	const slug = await getWorkspaceSlug(this);
	const projectId = rlcValue(this, 'projectId', 0);
	const epicId = rlcValue(this, 'epicId', 0);

	const response = await planeRequest.call(this, {
		method: 'GET',
		url: API_ENDPOINTS.EPIC(slug, projectId, epicId),
	});

	return this.helpers.returnJsonArray(Array.isArray(response) ? response : [response]);
}
