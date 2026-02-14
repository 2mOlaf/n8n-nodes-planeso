import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeProperties,
} from 'n8n-workflow';

import { API_ENDPOINTS } from '../../utils/constants';
import { planeRequest, getWorkspaceSlug } from '../../utils/helpers';

const showFor = {
	operation: ['get'],
	resource: ['epic'],
};

export const epicGetDescription: INodeProperties[] = [
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
		displayName: 'Epic ID',
		name: 'epicId',
		type: 'string',
		default: '',
		required: true,
		description: 'The ID of the epic to retrieve',
		displayOptions: {
			show: showFor,
		},
	},
];

export async function epicGet(
	this: IExecuteFunctions,
): Promise<INodeExecutionData[]> {
	const slug = await getWorkspaceSlug(this);
	const projectId = this.getNodeParameter('projectId', 0) as string;
	const epicId = this.getNodeParameter('epicId', 0) as string;

	const response = await planeRequest.call(this, {
		method: 'GET',
		url: API_ENDPOINTS.EPIC(slug, projectId, epicId),
	});

	return this.helpers.returnJsonArray(Array.isArray(response) ? response : [response]);
}
