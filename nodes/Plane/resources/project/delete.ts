import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeProperties,
} from 'n8n-workflow';

import { API_ENDPOINTS } from '../../utils/constants';
import { getWorkspaceSlug, planeRequest, rlcValue } from '../../utils/helpers';
import { projectRlc } from '../../utils/rlcDefs';

const showFor = {
	operation: ['delete'],
	resource: ['project'],
};

export const projectDeleteDescription: INodeProperties[] = [
	projectRlc(showFor),
];

export async function projectDelete(
	this: IExecuteFunctions,
): Promise<INodeExecutionData[]> {
	const slug = await getWorkspaceSlug(this);
	const projectId = rlcValue(this, 'projectId', 0);

	await planeRequest.call(this, {
		method: 'DELETE',
		url: API_ENDPOINTS.PROJECT(slug, projectId),
	});

	return this.helpers.returnJsonArray([{ success: true }]);
}
