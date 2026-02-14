import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeProperties,
} from 'n8n-workflow';

import { API_ENDPOINTS } from '../../utils/constants';
import { getWorkspaceSlug, planeRequest } from '../../utils/helpers';

const showFor = {
	operation: ['delete'],
	resource: ['state'],
};

export const stateDeleteDescription: INodeProperties[] = [
	{
		displayName: 'Project ID',
		name: 'projectId',
		type: 'string',
		default: '',
		required: true,
		description: 'The ID of the project the state belongs to',
		displayOptions: {
			show: showFor,
		},
	},
	{
		displayName: 'State ID',
		name: 'stateId',
		type: 'string',
		default: '',
		required: true,
		description: 'The ID of the state to delete',
		displayOptions: {
			show: showFor,
		},
	},
];

export async function stateDelete(
	this: IExecuteFunctions,
): Promise<INodeExecutionData[]> {
	const slug = await getWorkspaceSlug(this);
	const projectId = this.getNodeParameter('projectId', 0) as string;
	const stateId = this.getNodeParameter('stateId', 0) as string;

	await planeRequest.call(this, {
		method: 'DELETE',
		url: API_ENDPOINTS.STATE(slug, projectId, stateId),
	});

	return this.helpers.returnJsonArray([{ success: true }]);
}
