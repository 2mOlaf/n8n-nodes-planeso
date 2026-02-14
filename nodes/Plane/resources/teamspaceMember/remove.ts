import type {
	IDataObject,
	IExecuteFunctions,
	INodeExecutionData,
	INodeProperties,
} from 'n8n-workflow';

import { API_ENDPOINTS } from '../../utils/constants';
import { getWorkspaceSlug, planeRequest } from '../../utils/helpers';

const showFor = {
	operation: ['remove'],
	resource: ['teamspaceMember'],
};

export const teamspaceMemberRemoveDescription: INodeProperties[] = [
	{
		displayName: 'Teamspace ID',
		name: 'teamspaceId',
		type: 'string',
		default: '',
		required: true,
		description: 'The ID of the teamspace to remove members from',
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
		description: 'Comma-separated UUIDs of the members to remove',
		displayOptions: {
			show: showFor,
		},
	},
];

export async function teamspaceMemberRemove(
	this: IExecuteFunctions,
): Promise<INodeExecutionData[]> {
	const slug = await getWorkspaceSlug(this);
	const teamspaceId = this.getNodeParameter('teamspaceId', 0) as string;
	const memberIdsRaw = this.getNodeParameter('member_ids', 0) as string;
	const member_ids = memberIdsRaw.split(',').map((id) => id.trim());

	const body: IDataObject = {
		member_ids,
	};

	await planeRequest.call(this, {
		method: 'DELETE',
		url: API_ENDPOINTS.TEAMSPACE_MEMBERS(slug, teamspaceId),
		body,
	});

	return this.helpers.returnJsonArray([{ success: true }]);
}
