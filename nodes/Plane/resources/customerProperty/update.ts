import type {
	IDataObject,
	IExecuteFunctions,
	INodeExecutionData,
	INodeProperties,
} from 'n8n-workflow';

import { API_ENDPOINTS } from '../../utils/constants';
import { getWorkspaceSlug, planeRequest } from '../../utils/helpers';

const showFor = {
	operation: ['update'],
	resource: ['customerProperty'],
};

export const customerPropertyUpdateDescription: INodeProperties[] = [
	{
		displayName: 'Property ID',
		name: 'propertyId',
		type: 'string',
		default: '',
		required: true,
		description: 'The ID of the customer property to update',
		displayOptions: {
			show: showFor,
		},
	},
	{
		displayName: 'Update Fields',
		name: 'updateFields',
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
				description: 'The description of the customer property',
			},
			{
				displayName: 'Display Name',
				name: 'display_name',
				type: 'string',
				default: '',
				description: 'The display name of the customer property',
			},
			{
				displayName: 'Is Required',
				name: 'is_required',
				type: 'boolean',
				default: false,
				description: 'Whether this property is required',
			},
			{
				displayName: 'Property Type',
				name: 'property_type',
				type: 'options',
				default: 'text',
				options: [
					{
						name: 'Checkbox',
						value: 'checkbox',
					},
					{
						name: 'Date',
						value: 'date',
					},
					{
						name: 'Multi Select',
						value: 'multi_select',
					},
					{
						name: 'Number',
						value: 'number',
					},
					{
						name: 'Select',
						value: 'select',
					},
					{
						name: 'Text',
						value: 'text',
					},
				],
				description: 'The type of the customer property',
			},
		],
	},
];

export async function customerPropertyUpdate(
	this: IExecuteFunctions,
): Promise<INodeExecutionData[]> {
	const slug = await getWorkspaceSlug(this);
	const propertyId = this.getNodeParameter('propertyId', 0) as string;
	const updateFields = this.getNodeParameter('updateFields', 0) as IDataObject;

	const body: IDataObject = {
		...updateFields,
	};

	const response = await planeRequest.call(this, {
		method: 'PATCH',
		url: API_ENDPOINTS.CUSTOMER_PROPERTY(slug, propertyId),
		body,
	});

	const results = Array.isArray(response) ? response : [response];
	return this.helpers.returnJsonArray(results);
}
