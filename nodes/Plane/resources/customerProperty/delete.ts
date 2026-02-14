import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeProperties,
} from 'n8n-workflow';

import { API_ENDPOINTS } from '../../utils/constants';
import { getWorkspaceSlug, planeRequest } from '../../utils/helpers';

const showFor = {
	operation: ['delete'],
	resource: ['customerProperty'],
};

export const customerPropertyDeleteDescription: INodeProperties[] = [
	{
		displayName: 'Property ID',
		name: 'propertyId',
		type: 'string',
		default: '',
		required: true,
		description: 'The ID of the customer property to delete',
		displayOptions: {
			show: showFor,
		},
	},
];

export async function customerPropertyDelete(
	this: IExecuteFunctions,
): Promise<INodeExecutionData[]> {
	const slug = await getWorkspaceSlug(this);
	const propertyId = this.getNodeParameter('propertyId', 0) as string;

	await planeRequest.call(this, {
		method: 'DELETE',
		url: API_ENDPOINTS.CUSTOMER_PROPERTY(slug, propertyId),
	});

	return this.helpers.returnJsonArray([{ success: true }]);
}
