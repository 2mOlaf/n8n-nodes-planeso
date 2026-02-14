import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeProperties,
} from 'n8n-workflow';

import { API_ENDPOINTS } from '../../utils/constants';
import { getWorkspaceSlug, planeRequest, rlcValue } from '../../utils/helpers';
import { teamspaceRlc } from '../../utils/rlcDefs';

const showFor = {
	operation: ['delete'],
	resource: ['teamspace'],
};

export const teamspaceDeleteDescription: INodeProperties[] = [
	teamspaceRlc(showFor),
];

export async function teamspaceDelete(
	this: IExecuteFunctions,
): Promise<INodeExecutionData[]> {
	const slug = await getWorkspaceSlug(this);
	const teamspaceId = rlcValue(this, 'teamspaceId', 0);

	await planeRequest.call(this, {
		method: 'DELETE',
		url: API_ENDPOINTS.TEAMSPACE(slug, teamspaceId),
	});

	return this.helpers.returnJsonArray([{ success: true }]);
}
