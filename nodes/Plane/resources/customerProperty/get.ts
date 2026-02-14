import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeProperties,
} from 'n8n-workflow';

import { API_ENDPOINTS } from '../../utils/constants';
import { getWorkspaceSlug, planeRequest } from '../../utils/helpers';

const showFor = {
	operation: ['get'],
	resource: ['customerProperty'],
};

export const customerPropertyGetDescription: INodeProperties[] = [
	{
		displayName: 'Property ID',
		name: 'propertyId',
		type: 'string',
		default: '',
		required: true,
		description: 'The ID of the customer property to retrieve',
		displayOptions: {
			show: showFor,
		},
	},
];

export async function customerPropertyGet(
	this: IExecuteFunctions,
): Promise<INodeExecutionData[]> {
	const slug = await getWorkspaceSlug(this);
	const propertyId = this.getNodeParameter('propertyId', 0) as string;

	const response = await planeRequest.call(this, {
		method: 'GET',
		url: API_ENDPOINTS.CUSTOMER_PROPERTY(slug, propertyId),
	});

	const results = Array.isArray(response) ? response : [response];
	return this.helpers.returnJsonArray(results);
}
