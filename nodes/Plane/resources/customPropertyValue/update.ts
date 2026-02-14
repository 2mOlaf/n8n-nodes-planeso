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
	resource: ['customPropertyValue'],
};

export const customPropertyValueUpdateDescription: INodeProperties[] = [
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
		displayName: 'Work Item ID',
		name: 'workItemId',
		type: 'string',
		default: '',
		required: true,
		description: 'The ID of the work item',
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
		description: 'The ID of the custom property to set the value for',
		displayOptions: {
			show: showFor,
		},
	},
	{
		displayName: 'Value',
		name: 'value',
		type: 'string',
		default: '',
		required: true,
		description: 'The property value to set',
		displayOptions: {
			show: showFor,
		},
	},
];

export async function customPropertyValueUpdate(
	this: IExecuteFunctions,
): Promise<INodeExecutionData[]> {
	const slug = await getWorkspaceSlug(this);
	const projectId = this.getNodeParameter('projectId', 0) as string;
	const workItemId = this.getNodeParameter('workItemId', 0) as string;
	const propertyId = this.getNodeParameter('propertyId', 0) as string;
	const value = this.getNodeParameter('value', 0) as string;

	const body: IDataObject = {
		value,
	};

	const response = await planeRequest.call(this, {
		method: 'PATCH',
		url: API_ENDPOINTS.CUSTOM_PROPERTY_VALUE(slug, projectId, workItemId, propertyId),
		body,
	});

	const results = Array.isArray(response) ? response : [response];
	return this.helpers.returnJsonArray(results);
}
