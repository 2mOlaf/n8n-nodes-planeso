import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeProperties,
} from 'n8n-workflow';

import { API_ENDPOINTS } from '../../utils/constants';
import { getWorkspaceSlug, planeRequest } from '../../utils/helpers';

const showFor = {
	operation: ['unlinkWorkItem'],
	resource: ['customer'],
};

export const customerUnlinkWorkItemDescription: INodeProperties[] = [
	{
		displayName: 'Customer ID',
		name: 'customerId',
		type: 'string',
		default: '',
		required: true,
		description: 'The ID of the customer to unlink the work item from',
		displayOptions: {
			show: showFor,
		},
	},
	{
		displayName: 'Work Item ID',
		name: 'workItemId',
		type: 'string',
		default: '',
		required: true,
		description: 'The ID of the work item to unlink from the customer',
		displayOptions: {
			show: showFor,
		},
	},
];

export async function customerUnlinkWorkItem(
	this: IExecuteFunctions,
): Promise<INodeExecutionData[]> {
	const slug = await getWorkspaceSlug(this);
	const customerId = this.getNodeParameter('customerId', 0) as string;
	const workItemId = this.getNodeParameter('workItemId', 0) as string;

	await planeRequest.call(this, {
		method: 'DELETE',
		url: `${API_ENDPOINTS.CUSTOMER_WORK_ITEMS(slug, customerId)}${workItemId}/`,
	});

	return this.helpers.returnJsonArray([{ success: true }]);
}
