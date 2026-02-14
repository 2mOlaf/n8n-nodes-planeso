import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeProperties,
} from 'n8n-workflow';

import { API_ENDPOINTS } from '../../utils/constants';
import { planeRequest, getWorkspaceSlug } from '../../utils/helpers';

const showFor = {
	operation: ['get'],
	resource: ['cycle'],
};

export const cycleGetDescription: INodeProperties[] = [
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
		description: 'The ID of the cycle to retrieve',
		displayOptions: {
			show: showFor,
		},
	},
];

export async function cycleGet(
	this: IExecuteFunctions,
): Promise<INodeExecutionData[]> {
	const slug = await getWorkspaceSlug(this);
	const projectId = this.getNodeParameter('projectId', 0) as string;
	const cycleId = this.getNodeParameter('cycleId', 0) as string;

	const response = await planeRequest.call(this, {
		method: 'GET',
		url: API_ENDPOINTS.CYCLE(slug, projectId, cycleId),
	});

	return this.helpers.returnJsonArray(Array.isArray(response) ? response : [response]);
}
