import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeProperties,
} from 'n8n-workflow';

import { API_ENDPOINTS } from '../../utils/constants';
import { planeRequest, getWorkspaceSlug } from '../../utils/helpers';

const showFor = {
	operation: ['delete'],
	resource: ['module'],
};

export const moduleDeleteDescription: INodeProperties[] = [
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
		description: 'The ID of the module to delete',
		displayOptions: {
			show: showFor,
		},
	},
];

export async function moduleDelete(
	this: IExecuteFunctions,
): Promise<INodeExecutionData[]> {
	const slug = await getWorkspaceSlug(this);
	const projectId = this.getNodeParameter('projectId', 0) as string;
	const moduleId = this.getNodeParameter('moduleId', 0) as string;

	await planeRequest.call(this, {
		method: 'DELETE',
		url: API_ENDPOINTS.MODULE(slug, projectId, moduleId),
	});

	return this.helpers.returnJsonArray([{ success: true }]);
}
