import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeProperties,
} from 'n8n-workflow';

import { API_ENDPOINTS } from '../../utils/constants';
import { planeRequest, getWorkspaceSlug, rlcValue } from '../../utils/helpers';
import { projectRlc, cycleRlc } from '../../utils/rlcDefs';

const showFor = {
	operation: ['delete'],
	resource: ['cycle'],
};

export const cycleDeleteDescription: INodeProperties[] = [
	projectRlc(showFor),
	cycleRlc(showFor),
];

export async function cycleDelete(
	this: IExecuteFunctions,
): Promise<INodeExecutionData[]> {
	const slug = await getWorkspaceSlug(this);
	const projectId = rlcValue(this, 'projectId', 0);
	const cycleId = rlcValue(this, 'cycleId', 0);

	await planeRequest.call(this, {
		method: 'DELETE',
		url: API_ENDPOINTS.CYCLE(slug, projectId, cycleId),
	});

	return this.helpers.returnJsonArray([{ success: true }]);
}
