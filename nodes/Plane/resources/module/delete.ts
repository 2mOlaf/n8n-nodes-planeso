import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeProperties,
} from 'n8n-workflow';

import { API_ENDPOINTS } from '../../utils/constants';
import { planeRequest, getWorkspaceSlug, rlcValue } from '../../utils/helpers';
import { projectRlc, moduleRlc } from '../../utils/rlcDefs';

const showFor = {
	operation: ['delete'],
	resource: ['module'],
};

export const moduleDeleteDescription: INodeProperties[] = [
	projectRlc(showFor),
	moduleRlc(showFor),
];

export async function moduleDelete(
	this: IExecuteFunctions,
): Promise<INodeExecutionData[]> {
	const slug = await getWorkspaceSlug(this);
	const projectId = rlcValue(this, 'projectId', 0);
	const moduleId = rlcValue(this, 'moduleId', 0);

	await planeRequest.call(this, {
		method: 'DELETE',
		url: API_ENDPOINTS.MODULE(slug, projectId, moduleId),
	});

	return this.helpers.returnJsonArray([{ success: true }]);
}
