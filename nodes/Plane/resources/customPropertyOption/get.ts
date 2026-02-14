import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeProperties,
} from 'n8n-workflow';

import { API_ENDPOINTS } from '../../utils/constants';
import { getWorkspaceSlug, planeRequest } from '../../utils/helpers';

const showFor = {
	operation: ['get'],
	resource: ['customPropertyOption'],
};

export const customPropertyOptionGetDescription: INodeProperties[] = [
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
		displayName: 'Option ID',
		name: 'optionId',
		type: 'string',
		default: '',
		required: true,
		description: 'The ID of the option to retrieve',
		displayOptions: {
			show: showFor,
		},
	},
];

export async function customPropertyOptionGet(
	this: IExecuteFunctions,
): Promise<INodeExecutionData[]> {
	const slug = await getWorkspaceSlug(this);
	const projectId = this.getNodeParameter('projectId', 0) as string;
	const propertyId = this.getNodeParameter('propertyId', 0) as string;
	const optionId = this.getNodeParameter('optionId', 0) as string;

	const response = await planeRequest.call(this, {
		method: 'GET',
		url: API_ENDPOINTS.CUSTOM_PROPERTY_OPTION(slug, projectId, propertyId, optionId),
	});

	const results = Array.isArray(response) ? response : [response];
	return this.helpers.returnJsonArray(results);
}
