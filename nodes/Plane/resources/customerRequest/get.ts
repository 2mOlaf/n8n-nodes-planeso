import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeProperties,
} from 'n8n-workflow';

import { API_ENDPOINTS } from '../../utils/constants';
import { getWorkspaceSlug, planeRequest, rlcValue } from '../../utils/helpers';
import { customerRlc, customerRequestRlc } from '../../utils/rlcDefs';

const showFor = {
	operation: ['get'],
	resource: ['customerRequest'],
};

export const customerRequestGetDescription: INodeProperties[] = [
	customerRlc(showFor),
	customerRequestRlc(showFor),
];

export async function customerRequestGet(
	this: IExecuteFunctions,
): Promise<INodeExecutionData[]> {
	const slug = await getWorkspaceSlug(this);
	const customerId = rlcValue(this, 'customerId', 0);
	const requestId = rlcValue(this, 'requestId', 0);

	const response = await planeRequest.call(this, {
		method: 'GET',
		url: API_ENDPOINTS.CUSTOMER_REQUEST(slug, customerId, requestId),
	});

	const results = Array.isArray(response) ? response : [response];
	return this.helpers.returnJsonArray(results);
}
