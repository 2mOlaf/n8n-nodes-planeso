import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeProperties,
} from 'n8n-workflow';

import { API_ENDPOINTS } from '../../utils/constants';
import { getWorkspaceSlug, planeRequest, rlcValue } from '../../utils/helpers';
import { customerRlc, customerRequestRlc } from '../../utils/rlcDefs';

const showFor = {
	operation: ['delete'],
	resource: ['customerRequest'],
};

export const customerRequestDeleteDescription: INodeProperties[] = [
	customerRlc(showFor),
	customerRequestRlc(showFor),
];

export async function customerRequestDelete(
	this: IExecuteFunctions,
): Promise<INodeExecutionData[]> {
	const slug = await getWorkspaceSlug(this);
	const customerId = rlcValue(this, 'customerId', 0);
	const requestId = rlcValue(this, 'requestId', 0);

	await planeRequest.call(this, {
		method: 'DELETE',
		url: API_ENDPOINTS.CUSTOMER_REQUEST(slug, customerId, requestId),
	});

	return this.helpers.returnJsonArray([{ success: true }]);
}
