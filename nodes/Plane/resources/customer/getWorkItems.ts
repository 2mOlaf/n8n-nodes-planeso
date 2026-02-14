import type {
	IDataObject,
	IExecuteFunctions,
	INodeExecutionData,
	INodeProperties,
} from 'n8n-workflow';

import { API_ENDPOINTS } from '../../utils/constants';
import { getWorkspaceSlug, planeRequestOffsetAllItems } from '../../utils/helpers';

const showFor = {
	operation: ['getWorkItems'],
	resource: ['customer'],
};

export const customerGetWorkItemsDescription: INodeProperties[] = [
	{
		displayName: 'Customer ID',
		name: 'customerId',
		type: 'string',
		default: '',
		required: true,
		description: 'The ID of the customer to get work items for',
		displayOptions: {
			show: showFor,
		},
	},
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		default: false,
		description: 'Whether to return all results or only up to a given limit',
		displayOptions: {
			show: showFor,
		},
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		default: 50,
		description: 'Max number of results to return',
		typeOptions: {
			minValue: 1,
		},
		displayOptions: {
			show: {
				...showFor,
				returnAll: [false],
			},
		},
	},
];

export async function customerGetWorkItems(
	this: IExecuteFunctions,
): Promise<INodeExecutionData[]> {
	const slug = await getWorkspaceSlug(this);
	const customerId = this.getNodeParameter('customerId', 0) as string;
	const returnAll = this.getNodeParameter('returnAll', 0) as boolean;
	const limit = this.getNodeParameter('limit', 0, 50) as number;

	const results = await planeRequestOffsetAllItems.call(
		this,
		{
			method: 'GET',
			url: API_ENDPOINTS.CUSTOMER_WORK_ITEMS(slug, customerId),
		},
		returnAll,
		limit,
	);

	return this.helpers.returnJsonArray(results as IDataObject[]);
}
