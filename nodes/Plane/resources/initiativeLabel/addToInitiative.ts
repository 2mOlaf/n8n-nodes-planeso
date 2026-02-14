import type {
	IDataObject,
	IExecuteFunctions,
	INodeExecutionData,
	INodeProperties,
} from 'n8n-workflow';

import { API_ENDPOINTS } from '../../utils/constants';
import { getWorkspaceSlug, planeRequest } from '../../utils/helpers';

const showFor = {
	operation: ['addToInitiative'],
	resource: ['initiativeLabel'],
};

export const initiativeLabelAddToInitiativeDescription: INodeProperties[] = [
	{
		displayName: 'Initiative ID',
		name: 'initiativeId',
		type: 'string',
		default: '',
		required: true,
		description: 'The ID of the initiative to add labels to',
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
		description: 'Comma-separated list of label UUIDs to add to the initiative',
		displayOptions: {
			show: showFor,
		},
	},
];

export async function initiativeLabelAddToInitiative(
	this: IExecuteFunctions,
): Promise<INodeExecutionData[]> {
	const slug = await getWorkspaceSlug(this);
	const initiativeId = this.getNodeParameter('initiativeId', 0) as string;
	const labelIdsRaw = this.getNodeParameter('label_ids', 0) as string;
	const label_ids = labelIdsRaw.split(',').map((id) => id.trim());

	const body: IDataObject = {
		label_ids,
	};

	const response = await planeRequest.call(this, {
		method: 'POST',
		url: API_ENDPOINTS.INITIATIVE_LABELS_FOR(slug, initiativeId),
		body,
	});

	return this.helpers.returnJsonArray(Array.isArray(response) ? response : [response]);
}
