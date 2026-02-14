import type {
	IDataObject,
	IExecuteFunctions,
	INodeExecutionData,
	INodeProperties,
} from 'n8n-workflow';

import { API_ENDPOINTS } from '../../utils/constants';
import { getWorkspaceSlug, planeRequest } from '../../utils/helpers';

const showFor = {
	operation: ['add'],
	resource: ['teamspaceMember'],
};

export const teamspaceMemberAddDescription: INodeProperties[] = [
	{
		displayName: 'Teamspace ID',
		name: 'teamspaceId',
		type: 'string',
		default: '',
		required: true,
		description: 'The ID of the teamspace to add members to',
		displayOptions: {
			show: showFor,
		},
	},
	{
		displayName: 'Member IDs',
		name: 'member_ids',
		type: 'string',
		default: '',
		required: true,
		description: 'Comma-separated UUIDs of the members to add',
		displayOptions: {
			show: showFor,
		},
	},
];

export async function teamspaceMemberAdd(
	this: IExecuteFunctions,
): Promise<INodeExecutionData[]> {
	const slug = await getWorkspaceSlug(this);
	const teamspaceId = this.getNodeParameter('teamspaceId', 0) as string;
	const memberIdsRaw = this.getNodeParameter('member_ids', 0) as string;
	const member_ids = memberIdsRaw.split(',').map((id) => id.trim());

	const body: IDataObject = {
		member_ids,
	};

	const response = await planeRequest.call(this, {
		method: 'POST',
		url: API_ENDPOINTS.TEAMSPACE_MEMBERS(slug, teamspaceId),
		body,
	});

	const results = Array.isArray(response) ? response : [response];
	return this.helpers.returnJsonArray(results);
}
