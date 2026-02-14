import type {
	IDataObject,
	IExecuteFunctions,
	INodeExecutionData,
	INodeProperties,
} from 'n8n-workflow';

import { API_ENDPOINTS } from '../../utils/constants';
import { getWorkspaceSlug, planeRequest } from '../../utils/helpers';

const showFor = {
	operation: ['removeFromInitiative'],
	resource: ['initiativeLabel'],
};

export const initiativeLabelRemoveFromInitiativeDescription: INodeProperties[] = [
	{
		displayName: 'Initiative ID',
		name: 'initiativeId',
		type: 'string',
		default: '',
		required: true,
		description: 'The ID of the initiative to remove labels from',
		displayOptions: {
			show: showFor,
		},
	},
	{
		displayName: 'Label IDs',
		name: 'label_ids',
		type: 'string',
		default: '',
		required: true,
		description: 'Comma-separated list of label UUIDs to remove from the initiative',
		displayOptions: {
			show: showFor,
		},
	},
];

export async function initiativeLabelRemoveFromInitiative(
	this: IExecuteFunctions,
): Promise<INodeExecutionData[]> {
	const slug = await getWorkspaceSlug(this);
	const initiativeId = this.getNodeParameter('initiativeId', 0) as string;
	const labelIdsRaw = this.getNodeParameter('label_ids', 0) as string;
	const label_ids = labelIdsRaw.split(',').map((id) => id.trim());

	const body: IDataObject = {
		label_ids,
	};

	await planeRequest.call(this, {
		method: 'DELETE',
		url: API_ENDPOINTS.INITIATIVE_LABELS_FOR(slug, initiativeId),
		body,
	});

	return this.helpers.returnJsonArray([{ success: true }]);
}
