import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeProperties,
} from 'n8n-workflow';

import { API_ENDPOINTS } from '../../utils/constants';
import { getWorkspaceSlug, planeRequest } from '../../utils/helpers';

const showFor = {
	operation: ['delete'],
	resource: ['teamspace'],
};

export const teamspaceDeleteDescription: INodeProperties[] = [
	{
		displayName: 'Teamspace ID',
		name: 'teamspaceId',
		type: 'string',
		default: '',
		required: true,
		description: 'The ID of the teamspace to delete',
		displayOptions: {
			show: showFor,
		},
	},
];

export async function teamspaceDelete(
	this: IExecuteFunctions,
): Promise<INodeExecutionData[]> {
	const slug = await getWorkspaceSlug(this);
	const teamspaceId = this.getNodeParameter('teamspaceId', 0) as string;

	await planeRequest.call(this, {
		method: 'DELETE',
		url: API_ENDPOINTS.TEAMSPACE(slug, teamspaceId),
	});

	return this.helpers.returnJsonArray([{ success: true }]);
}
