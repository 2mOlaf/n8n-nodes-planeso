import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeProperties,
} from 'n8n-workflow';

import { API_ENDPOINTS } from '../../utils/constants';
import { getWorkspaceSlug, planeRequest, rlcValue } from '../../utils/helpers';
import { projectRlc, stateRlc } from '../../utils/rlcDefs';

const showFor = {
	operation: ['delete'],
	resource: ['state'],
};

export const stateDeleteDescription: INodeProperties[] = [
	projectRlc(showFor),
	stateRlc(showFor),
];

export async function stateDelete(
	this: IExecuteFunctions,
): Promise<INodeExecutionData[]> {
	const slug = await getWorkspaceSlug(this);
	const projectId = rlcValue(this, 'projectId', 0);
	const stateId = rlcValue(this, 'stateId', 0);

	await planeRequest.call(this, {
		method: 'DELETE',
		url: API_ENDPOINTS.STATE(slug, projectId, stateId),
	});

	return this.helpers.returnJsonArray([{ success: true }]);
}
