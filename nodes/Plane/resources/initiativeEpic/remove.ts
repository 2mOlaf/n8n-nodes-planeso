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
	resource: ['initiativeEpic'],
};

export const initiativeEpicRemoveDescription: INodeProperties[] = [
	{
		displayName: 'Initiative ID',
		name: 'initiativeId',
		type: 'string',
		default: '',
		required: true,
		description: 'The ID of the initiative to remove epics from',
		displayOptions: {
			show: showFor,
		},
	},
	{
		displayName: 'Epic IDs',
		name: 'epic_ids',
		type: 'string',
		default: '',
		required: true,
		description: 'Comma-separated list of epic UUIDs to remove from the initiative',
		displayOptions: {
			show: showFor,
		},
	},
];

export async function initiativeEpicRemove(
	this: IExecuteFunctions,
): Promise<INodeExecutionData[]> {
	const slug = await getWorkspaceSlug(this);
	const initiativeId = this.getNodeParameter('initiativeId', 0) as string;
	const epicIdsRaw = this.getNodeParameter('epic_ids', 0) as string;
	const epic_ids = epicIdsRaw.split(',').map((id) => id.trim());

	const body: IDataObject = {
		epic_ids,
	};

	await planeRequest.call(this, {
		method: 'DELETE',
		url: API_ENDPOINTS.INITIATIVE_EPICS(slug, initiativeId),
		body,
	});

	return this.helpers.returnJsonArray([{ success: true }]);
}
