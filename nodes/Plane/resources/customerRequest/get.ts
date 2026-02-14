import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeProperties,
} from 'n8n-workflow';

import { API_ENDPOINTS } from '../../utils/constants';
import { getWorkspaceSlug, planeRequest } from '../../utils/helpers';

const showFor = {
	operation: ['get'],
	resource: ['customerRequest'],
};

export const customerRequestGetDescription: INodeProperties[] = [
	{
		displayName: 'Customer ID',
		name: 'customerId',
		type: 'string',
		default: '',
		required: true,
		description: 'The ID of the customer',
		displayOptions: {
			show: showFor,
		},
	},
	{
		displayName: 'Request ID',
		name: 'requestId',
		type: 'string',
		default: '',
		required: true,
		description: 'The ID of the customer request to retrieve',
		displayOptions: {
			show: showFor,
		},
	},
];

export async function customerRequestGet(
	this: IExecuteFunctions,
): Promise<INodeExecutionData[]> {
	const slug = await getWorkspaceSlug(this);
	const customerId = this.getNodeParameter('customerId', 0) as string;
	const requestId = this.getNodeParameter('requestId', 0) as string;

	const response = await planeRequest.call(this, {
		method: 'GET',
		url: API_ENDPOINTS.CUSTOMER_REQUEST(slug, customerId, requestId),
	});

	const results = Array.isArray(response) ? response : [response];
	return this.helpers.returnJsonArray(results);
}
