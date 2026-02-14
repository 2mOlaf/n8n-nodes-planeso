import type {
	IDataObject,
	IExecuteFunctions,
	INodeExecutionData,
	INodeProperties,
} from 'n8n-workflow';

import { API_ENDPOINTS } from '../../utils/constants';
import { getWorkspaceSlug, planeRequest, rlcValue } from '../../utils/helpers';
import { teamspaceRlc } from '../../utils/rlcDefs';

const showFor = {
	operation: ['remove'],
	resource: ['teamspaceMember'],
};

export const teamspaceMemberRemoveDescription: INodeProperties[] = [
	teamspaceRlc(showFor),
	{
		displayName: 'Member Names or IDs',
		name: 'member_ids',
		type: 'multiOptions',
		default: [],
		required: true,
		description: 'The members to select. Choose from the list, or specify IDs using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
		typeOptions: {
			loadOptionsMethod: 'getMembers',
		},
		displayOptions: {
			show: showFor,
		},
	},
];

export async function teamspaceMemberRemove(
	this: IExecuteFunctions,
): Promise<INodeExecutionData[]> {
	const slug = await getWorkspaceSlug(this);
	const teamspaceId = rlcValue(this, 'teamspaceId', 0);
	const memberIdsRaw = this.getNodeParameter('member_ids', 0);
	const member_ids = Array.isArray(memberIdsRaw) ? memberIdsRaw : (memberIdsRaw as string).split(',').map((id) => id.trim());

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
