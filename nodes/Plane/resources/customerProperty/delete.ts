import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeProperties,
} from 'n8n-workflow';

import { API_ENDPOINTS } from '../../utils/constants';
import { getWorkspaceSlug, planeRequest, rlcValue } from '../../utils/helpers';
import { propertyRlc } from '../../utils/rlcDefs';

const showFor = {
	operation: ['delete'],
	resource: ['customerProperty'],
};

export const customerPropertyDeleteDescription: INodeProperties[] = [
	propertyRlc(showFor),
];

export async function customerPropertyDelete(
	this: IExecuteFunctions,
): Promise<INodeExecutionData[]> {
	const slug = await getWorkspaceSlug(this);
	const propertyId = rlcValue(this, 'propertyId', 0);

	await planeRequest.call(this, {
		method: 'DELETE',
		url: API_ENDPOINTS.CUSTOMER_PROPERTY(slug, propertyId),
	});

	return this.helpers.returnJsonArray([{ success: true }]);
}
