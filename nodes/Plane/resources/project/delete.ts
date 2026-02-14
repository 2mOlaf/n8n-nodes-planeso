import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeProperties,
} from 'n8n-workflow';

import { API_ENDPOINTS } from '../../utils/constants';
import { getWorkspaceSlug, planeRequest } from '../../utils/helpers';

const showFor = {
	operation: ['delete'],
	resource: ['project'],
};

export const projectDeleteDescription: INodeProperties[] = [
	{
		displayName: 'Project ID',
		name: 'projectId',
		type: 'string',
		default: '',
		required: true,
		description: 'The ID of the project to delete',
		displayOptions: {
			show: showFor,
		},
	},
];

export async function projectDelete(
	this: IExecuteFunctions,
): Promise<INodeExecutionData[]> {
	const slug = await getWorkspaceSlug(this);
	const projectId = this.getNodeParameter('projectId', 0) as string;

	await planeRequest.call(this, {
		method: 'DELETE',
		url: API_ENDPOINTS.PROJECT(slug, projectId),
	});

	return this.helpers.returnJsonArray([{ success: true }]);
}
