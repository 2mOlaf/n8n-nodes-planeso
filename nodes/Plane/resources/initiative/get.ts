import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeProperties,
} from 'n8n-workflow';

import { API_ENDPOINTS } from '../../utils/constants';
import { getWorkspaceSlug, planeRequest, rlcValue } from '../../utils/helpers';
import { initiativeRlc } from '../../utils/rlcDefs';

const showFor = {
	operation: ['get'],
	resource: ['initiative'],
};

export const initiativeGetDescription: INodeProperties[] = [
	initiativeRlc(showFor),
];

export async function initiativeGet(
	this: IExecuteFunctions,
): Promise<INodeExecutionData[]> {
	const slug = await getWorkspaceSlug(this);
	const initiativeId = rlcValue(this, 'initiativeId', 0);

	const response = await planeRequest.call(this, {
		method: 'GET',
		url: API_ENDPOINTS.INITIATIVE(slug, initiativeId),
	});

	return this.helpers.returnJsonArray(Array.isArray(response) ? response : [response]);
}
