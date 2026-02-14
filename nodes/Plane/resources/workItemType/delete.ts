import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeProperties,
} from 'n8n-workflow';

import { API_ENDPOINTS } from '../../utils/constants';
import { planeRequest, getWorkspaceSlug, rlcValue } from '../../utils/helpers';
import { projectRlc, workItemTypeRlc } from '../../utils/rlcDefs';

const showFor = {
	operation: ['delete'],
	resource: ['workItemType'],
};

export const workItemTypeDeleteDescription: INodeProperties[] = [
	projectRlc(showFor),
	workItemTypeRlc(showFor),
];

export async function workItemTypeDelete(
	this: IExecuteFunctions,
): Promise<INodeExecutionData[]> {
	const slug = await getWorkspaceSlug(this);
	const projectId = rlcValue(this, 'projectId', 0);
	const typeId = rlcValue(this, 'typeId', 0);

	const response = await planeRequest.call(this, {
		method: 'DELETE',
		url: API_ENDPOINTS.WORK_ITEM_TYPE(slug, projectId, typeId),
	});

	return this.helpers.returnJsonArray(Array.isArray(response) ? response : [response]);
}
