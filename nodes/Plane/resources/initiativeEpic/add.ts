import type {
	IDataObject,
	IExecuteFunctions,
	INodeExecutionData,
	INodeProperties,
} from 'n8n-workflow';

import { API_ENDPOINTS } from '../../utils/constants';
import { getWorkspaceSlug, planeRequest, rlcValue } from '../../utils/helpers';
import { initiativeRlc } from '../../utils/rlcDefs';

const showFor = {
	operation: ['add'],
	resource: ['initiativeEpic'],
};

export const initiativeEpicAddDescription: INodeProperties[] = [
	initiativeRlc(showFor),
	{
		displayName: 'Epic IDs',
		name: 'epic_ids',
		type: 'string',
		default: '',
		required: true,
		description: 'Comma-separated list of epic UUIDs to add to the initiative',
		displayOptions: {
			show: showFor,
		},
	},
];

export async function initiativeEpicAdd(
	this: IExecuteFunctions,
): Promise<INodeExecutionData[]> {
	const slug = await getWorkspaceSlug(this);
	const initiativeId = rlcValue(this, 'initiativeId', 0);
	const epicIdsRaw = this.getNodeParameter('epic_ids', 0) as string;
	const epic_ids = epicIdsRaw.split(',').map((id) => id.trim());

	const body: IDataObject = {
		epic_ids,
	};

	const response = await planeRequest.call(this, {
		method: 'POST',
		url: API_ENDPOINTS.INITIATIVE_EPICS(slug, initiativeId),
		body,
	});

	return this.helpers.returnJsonArray(Array.isArray(response) ? response : [response]);
}
