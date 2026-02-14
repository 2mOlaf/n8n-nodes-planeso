import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeProperties,
} from 'n8n-workflow';

import { API_ENDPOINTS } from '../../utils/constants';
import { planeRequest, getWorkspaceSlug } from '../../utils/helpers';

const showFor = {
	operation: ['delete'],
	resource: ['cycle'],
};

export const cycleDeleteDescription: INodeProperties[] = [
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
		displayName: 'Cycle ID',
		name: 'cycleId',
		type: 'string',
		default: '',
		required: true,
		description: 'The ID of the cycle to delete',
		displayOptions: {
			show: showFor,
		},
	},
];

export async function cycleDelete(
	this: IExecuteFunctions,
): Promise<INodeExecutionData[]> {
	const slug = await getWorkspaceSlug(this);
	const projectId = this.getNodeParameter('projectId', 0) as string;
	const cycleId = this.getNodeParameter('cycleId', 0) as string;

	await planeRequest.call(this, {
		method: 'DELETE',
		url: API_ENDPOINTS.CYCLE(slug, projectId, cycleId),
	});

	return this.helpers.returnJsonArray([{ success: true }]);
}
