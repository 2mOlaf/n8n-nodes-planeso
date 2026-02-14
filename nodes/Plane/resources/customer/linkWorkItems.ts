import type {
	IDataObject,
	IExecuteFunctions,
	INodeExecutionData,
	INodeProperties,
} from 'n8n-workflow';

import { API_ENDPOINTS } from '../../utils/constants';
import { getWorkspaceSlug, planeRequest, rlcValue } from '../../utils/helpers';
import { customerRlc } from '../../utils/rlcDefs';

const showFor = {
	operation: ['linkWorkItems'],
	resource: ['customer'],
};

export const customerLinkWorkItemsDescription: INodeProperties[] = [
	customerRlc(showFor),
	{
		displayName: 'Work Item IDs',
		name: 'work_item_ids',
		type: 'string',
		default: '',
		required: true,
		description: 'Comma-separated list of work item UUIDs to link to the customer',
		displayOptions: {
			show: showFor,
		},
	},
];

export async function customerLinkWorkItems(
	this: IExecuteFunctions,
): Promise<INodeExecutionData[]> {
	const slug = await getWorkspaceSlug(this);
	const customerId = rlcValue(this, 'customerId', 0);
	const workItemIdsRaw = this.getNodeParameter('work_item_ids', 0) as string;

	const workItemIds = workItemIdsRaw.split(',').map((id) => id.trim());

	const body: IDataObject = {
		work_item_ids: workItemIds,
	};

	const response = await planeRequest.call(this, {
		method: 'POST',
		url: API_ENDPOINTS.CUSTOMER_WORK_ITEMS(slug, customerId),
		body,
	});

	const results = Array.isArray(response) ? response : [response];
	return this.helpers.returnJsonArray(results);
}
