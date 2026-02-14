import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeProperties,
} from 'n8n-workflow';

import { API_ENDPOINTS } from '../../utils/constants';
import { getWorkspaceSlug, planeRequest } from '../../utils/helpers';

const showFor = {
	operation: ['delete'],
	resource: ['customerRequest'],
};

export const customerRequestDeleteDescription: INodeProperties[] = [
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
		description: 'The ID of the customer request to delete',
		displayOptions: {
			show: showFor,
		},
	},
];

export async function customerRequestDelete(
	this: IExecuteFunctions,
): Promise<INodeExecutionData[]> {
	const slug = await getWorkspaceSlug(this);
	const customerId = this.getNodeParameter('customerId', 0) as string;
	const requestId = this.getNodeParameter('requestId', 0) as string;

	await planeRequest.call(this, {
		method: 'DELETE',
		url: API_ENDPOINTS.CUSTOMER_REQUEST(slug, customerId, requestId),
	});

	return this.helpers.returnJsonArray([{ success: true }]);
}
