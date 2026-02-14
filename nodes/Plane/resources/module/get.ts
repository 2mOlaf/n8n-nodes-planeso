import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeProperties,
} from 'n8n-workflow';

import { API_ENDPOINTS } from '../../utils/constants';
import { planeRequest, getWorkspaceSlug } from '../../utils/helpers';

const showFor = {
	operation: ['get'],
	resource: ['module'],
};

export const moduleGetDescription: INodeProperties[] = [
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
		displayName: 'Module ID',
		name: 'moduleId',
		type: 'string',
		default: '',
		required: true,
		description: 'The ID of the module to retrieve',
		displayOptions: {
			show: showFor,
		},
	},
];

export async function moduleGet(
	this: IExecuteFunctions,
): Promise<INodeExecutionData[]> {
	const slug = await getWorkspaceSlug(this);
	const projectId = this.getNodeParameter('projectId', 0) as string;
	const moduleId = this.getNodeParameter('moduleId', 0) as string;

	const response = await planeRequest.call(this, {
		method: 'GET',
		url: API_ENDPOINTS.MODULE(slug, projectId, moduleId),
	});

	return this.helpers.returnJsonArray(Array.isArray(response) ? response : [response]);
}
