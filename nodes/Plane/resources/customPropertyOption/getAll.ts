import type {
	IDataObject,
	IExecuteFunctions,
	INodeExecutionData,
	INodeProperties,
} from 'n8n-workflow';

import { API_ENDPOINTS } from '../../utils/constants';
import { getWorkspaceSlug, planeRequestOffsetAllItems } from '../../utils/helpers';

const showFor = {
	operation: ['getAll'],
	resource: ['customPropertyOption'],
};

export const customPropertyOptionGetAllDescription: INodeProperties[] = [
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
		displayName: 'Property ID',
		name: 'propertyId',
		type: 'string',
		default: '',
		required: true,
		description: 'The ID of the custom property',
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

export async function customPropertyOptionGetAll(
	this: IExecuteFunctions,
): Promise<INodeExecutionData[]> {
	const slug = await getWorkspaceSlug(this);
	const projectId = this.getNodeParameter('projectId', 0) as string;
	const propertyId = this.getNodeParameter('propertyId', 0) as string;
	const returnAll = this.getNodeParameter('returnAll', 0) as boolean;
	const limit = this.getNodeParameter('limit', 0, 50) as number;

	const results = await planeRequestOffsetAllItems.call(
		this,
		{
			method: 'GET',
			url: API_ENDPOINTS.CUSTOM_PROPERTY_OPTIONS(slug, projectId, propertyId),
		},
		returnAll,
		limit,
	);

	return this.helpers.returnJsonArray(results as IDataObject[]);
}
