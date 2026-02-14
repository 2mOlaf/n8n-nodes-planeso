import type {
	IDataObject,
	IExecuteFunctions,
	INodeExecutionData,
	INodeProperties,
} from 'n8n-workflow';

import { API_ENDPOINTS } from '../../utils/constants';
import { getWorkspaceSlug, planeRequest } from '../../utils/helpers';

const showFor = {
	operation: ['create'],
	resource: ['customerRequest'],
};

export const customerRequestCreateDescription: INodeProperties[] = [
	{
		displayName: 'Customer ID',
		name: 'customerId',
		type: 'string',
		default: '',
		required: true,
		description: 'The ID of the customer to create the request for',
		displayOptions: {
			show: showFor,
		},
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: showFor,
		},
		options: [
			{
				displayName: 'Description',
				name: 'description',
				type: 'string',
				default: '',
				description: 'The description of the customer request',
			},
			{
				displayName: 'Title',
				name: 'title',
				type: 'string',
				default: '',
				description: 'The title of the customer request',
			},
		],
	},
];

export async function customerRequestCreate(
	this: IExecuteFunctions,
): Promise<INodeExecutionData[]> {
	const slug = await getWorkspaceSlug(this);
	const customerId = this.getNodeParameter('customerId', 0) as string;
	const additionalFields = this.getNodeParameter('additionalFields', 0) as IDataObject;

	const body: IDataObject = {
		...additionalFields,
	};

	const response = await planeRequest.call(this, {
		method: 'POST',
		url: API_ENDPOINTS.CUSTOMER_REQUESTS(slug, customerId),
		body,
	});

	const results = Array.isArray(response) ? response : [response];
	return this.helpers.returnJsonArray(results);
}
