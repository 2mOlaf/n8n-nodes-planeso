import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeProperties,
} from 'n8n-workflow';

import { API_ENDPOINTS } from '../../utils/constants';
import { getWorkspaceSlug, planeRequest, rlcValue } from '../../utils/helpers';
import { customerRlc } from '../../utils/rlcDefs';

const showFor = {
	operation: ['delete'],
	resource: ['customer'],
};

export const customerDeleteDescription: INodeProperties[] = [
	customerRlc(showFor),
];

export async function customerDelete(
	this: IExecuteFunctions,
): Promise<INodeExecutionData[]> {
	const slug = await getWorkspaceSlug(this);
	const customerId = rlcValue(this, 'customerId', 0);

	await planeRequest.call(this, {
		method: 'DELETE',
		url: API_ENDPOINTS.CUSTOMER(slug, customerId),
	});

	return this.helpers.returnJsonArray([{ success: true }]);
}
