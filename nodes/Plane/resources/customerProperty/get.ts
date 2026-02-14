import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeProperties,
} from 'n8n-workflow';

import { API_ENDPOINTS } from '../../utils/constants';
import { getWorkspaceSlug, planeRequest, rlcValue } from '../../utils/helpers';
import { propertyRlc } from '../../utils/rlcDefs';

const showFor = {
	operation: ['get'],
	resource: ['customerProperty'],
};

export const customerPropertyGetDescription: INodeProperties[] = [
	propertyRlc(showFor),
];

export async function customerPropertyGet(
	this: IExecuteFunctions,
): Promise<INodeExecutionData[]> {
	const slug = await getWorkspaceSlug(this);
	const propertyId = rlcValue(this, 'propertyId', 0);

	const response = await planeRequest.call(this, {
		method: 'GET',
		url: API_ENDPOINTS.CUSTOMER_PROPERTY(slug, propertyId),
	});

	const results = Array.isArray(response) ? response : [response];
	return this.helpers.returnJsonArray(results);
}
