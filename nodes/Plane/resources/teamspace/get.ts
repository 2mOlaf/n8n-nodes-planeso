import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeProperties,
} from 'n8n-workflow';

import { API_ENDPOINTS } from '../../utils/constants';
import { getWorkspaceSlug, planeRequest, rlcValue } from '../../utils/helpers';
import { teamspaceRlc } from '../../utils/rlcDefs';

const showFor = {
	operation: ['get'],
	resource: ['teamspace'],
};

export const teamspaceGetDescription: INodeProperties[] = [
	teamspaceRlc(showFor),
];

export async function teamspaceGet(
	this: IExecuteFunctions,
): Promise<INodeExecutionData[]> {
	const slug = await getWorkspaceSlug(this);
	const teamspaceId = rlcValue(this, 'teamspaceId', 0);

	const response = await planeRequest.call(this, {
		method: 'GET',
		url: API_ENDPOINTS.TEAMSPACE(slug, teamspaceId),
	});

	const results = Array.isArray(response) ? response : [response];
	return this.helpers.returnJsonArray(results);
}
