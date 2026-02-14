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
	resource: ['customProperty'],
};

export const customPropertyUpdateDescription: INodeProperties[] = [
	{
		displayName: 'Project ID',
		name: 'projectId',
		type: 'string',
		default: '',
		required: true,
		description: 'The ID of the project',
		displayOptions: {
			show: showFor,
		},
	},
	{
		displayName: 'Type ID',
		name: 'typeId',
		type: 'string',
		default: '',
		required: true,
		description: 'The ID of the work item type',
		displayOptions: {
			show: showFor,
		},
	},
	{
		displayName: 'Property ID',
		name: 'propertyId',
		type: 'string',
		default: '',
		required: true,
		description: 'The ID of the custom property to update',
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
				description: 'The description of the custom property',
			},
			{
				displayName: 'Display Name',
				name: 'display_name',
				type: 'string',
				default: '',
				description: 'The display name of the custom property',
			},
			{
				displayName: 'Is Active',
				name: 'is_active',
				type: 'boolean',
				default: true,
				description: 'Whether the custom property is active',
			},
			{
				displayName: 'Is Multi',
				name: 'is_multi',
				type: 'boolean',
				default: false,
				description: 'Whether the custom property allows multiple values',
			},
			{
				displayName: 'Is Required',
				name: 'is_required',
				type: 'boolean',
				default: false,
				description: 'Whether the custom property is required',
			},
		],
	},
];

export async function customPropertyUpdate(
	this: IExecuteFunctions,
): Promise<INodeExecutionData[]> {
	const slug = await getWorkspaceSlug(this);
	const projectId = this.getNodeParameter('projectId', 0) as string;
	const typeId = this.getNodeParameter('typeId', 0) as string;
	const propertyId = this.getNodeParameter('propertyId', 0) as string;
	const updateFields = this.getNodeParameter('updateFields', 0) as IDataObject;

	const body: IDataObject = {
		...updateFields,
	};

	const response = await planeRequest.call(this, {
		method: 'PATCH',
		url: API_ENDPOINTS.CUSTOM_PROPERTY(slug, projectId, typeId, propertyId),
		body,
	});

	const results = Array.isArray(response) ? response : [response];
	return this.helpers.returnJsonArray(results);
}
