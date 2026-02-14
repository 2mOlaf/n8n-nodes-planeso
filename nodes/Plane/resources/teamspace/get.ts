import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeProperties,
} from 'n8n-workflow';

import { API_ENDPOINTS } from '../../utils/constants';
import { getWorkspaceSlug, planeRequest } from '../../utils/helpers';

const showFor = {
	operation: ['get'],
	resource: ['teamspace'],
};

export const teamspaceGetDescription: INodeProperties[] = [
	{
		displayName: 'Teamspace ID',
		name: 'teamspaceId',
		type: 'string',
		default: '',
		required: true,
		description: 'The ID of the teamspace to retrieve',
		displayOptions: {
			show: showFor,
		},
	},
];

export async function teamspaceGet(
	this: IExecuteFunctions,
): Promise<INodeExecutionData[]> {
	const slug = await getWorkspaceSlug(this);
	const teamspaceId = this.getNodeParameter('teamspaceId', 0) as string;

	const response = await planeRequest.call(this, {
		method: 'GET',
		url: API_ENDPOINTS.TEAMSPACE(slug, teamspaceId),
	});

	const results = Array.isArray(response) ? response : [response];
	return this.helpers.returnJsonArray(results);
}
