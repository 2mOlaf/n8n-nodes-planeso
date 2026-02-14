import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeProperties,
} from 'n8n-workflow';

import { API_ENDPOINTS } from '../../utils/constants';
import { getWorkspaceSlug, planeRequest } from '../../utils/helpers';

const showFor = {
	operation: ['delete'],
	resource: ['customProperty'],
};

export const customPropertyDeleteDescription: INodeProperties[] = [
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
		description: 'The ID of the custom property to delete',
		displayOptions: {
			show: showFor,
		},
	},
];

export async function customPropertyDelete(
	this: IExecuteFunctions,
): Promise<INodeExecutionData[]> {
	const slug = await getWorkspaceSlug(this);
	const projectId = this.getNodeParameter('projectId', 0) as string;
	const typeId = this.getNodeParameter('typeId', 0) as string;
	const propertyId = this.getNodeParameter('propertyId', 0) as string;

	await planeRequest.call(this, {
		method: 'DELETE',
		url: API_ENDPOINTS.CUSTOM_PROPERTY(slug, projectId, typeId, propertyId),
	});

	return this.helpers.returnJsonArray([{ success: true }]);
}
