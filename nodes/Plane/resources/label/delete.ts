import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeProperties,
} from 'n8n-workflow';

import { API_ENDPOINTS } from '../../utils/constants';
import { getWorkspaceSlug, planeRequest, rlcValue } from '../../utils/helpers';
import { projectRlc, labelRlc } from '../../utils/rlcDefs';

const showFor = {
	operation: ['delete'],
	resource: ['label'],
};

export const labelDeleteDescription: INodeProperties[] = [
	projectRlc(showFor),
	labelRlc(showFor),
];

export async function labelDelete(
	this: IExecuteFunctions,
): Promise<INodeExecutionData[]> {
	const slug = await getWorkspaceSlug(this);
	const projectId = rlcValue(this, 'projectId', 0);
	const labelId = rlcValue(this, 'labelId', 0);

	await planeRequest.call(this, {
		method: 'DELETE',
		url: API_ENDPOINTS.LABEL(slug, projectId, labelId),
	});

	return this.helpers.returnJsonArray([{ success: true }]);
}
