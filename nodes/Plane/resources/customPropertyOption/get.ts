import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeProperties,
} from 'n8n-workflow';

import { API_ENDPOINTS } from '../../utils/constants';
import { getWorkspaceSlug, planeRequest, rlcValue } from '../../utils/helpers';
import { projectRlc, propertyRlc, optionRlc } from '../../utils/rlcDefs';

const showFor = {
	operation: ['get'],
	resource: ['customPropertyOption'],
};

export const customPropertyOptionGetDescription: INodeProperties[] = [
	projectRlc(showFor),
	propertyRlc(showFor),
	optionRlc(showFor),
];

export async function customPropertyOptionGet(
	this: IExecuteFunctions,
): Promise<INodeExecutionData[]> {
	const slug = await getWorkspaceSlug(this);
	const projectId = rlcValue(this, 'projectId', 0);
	const propertyId = rlcValue(this, 'propertyId', 0);
	const optionId = rlcValue(this, 'optionId', 0);

	const response = await planeRequest.call(this, {
		method: 'GET',
		url: API_ENDPOINTS.CUSTOM_PROPERTY_OPTION(slug, projectId, propertyId, optionId),
	});

	const results = Array.isArray(response) ? response : [response];
	return this.helpers.returnJsonArray(results);
}
