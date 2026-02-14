import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeProperties,
} from 'n8n-workflow';

import { API_ENDPOINTS } from '../../utils/constants';
import { getWorkspaceSlug, planeRequest, rlcValue } from '../../utils/helpers';
import { projectRlc, workItemTypeRlc, propertyRlc } from '../../utils/rlcDefs';

const showFor = {
	operation: ['get'],
	resource: ['customProperty'],
};

export const customPropertyGetDescription: INodeProperties[] = [
	projectRlc(showFor),
	workItemTypeRlc(showFor),
	propertyRlc(showFor),
];

export async function customPropertyGet(
	this: IExecuteFunctions,
): Promise<INodeExecutionData[]> {
	const slug = await getWorkspaceSlug(this);
	const projectId = rlcValue(this, 'projectId', 0);
	const typeId = rlcValue(this, 'typeId', 0);
	const propertyId = rlcValue(this, 'propertyId', 0);

	const response = await planeRequest.call(this, {
		method: 'GET',
		url: API_ENDPOINTS.CUSTOM_PROPERTY(slug, projectId, typeId, propertyId),
	});

	const results = Array.isArray(response) ? response : [response];
	return this.helpers.returnJsonArray(results);
}
