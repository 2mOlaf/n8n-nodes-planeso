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
	operation: ['removeFromInitiative'],
	resource: ['initiativeLabel'],
};

export const initiativeLabelRemoveFromInitiativeDescription: INodeProperties[] = [
	initiativeRlc(showFor),
	{
		displayName: 'Label Names or IDs',
		name: 'label_ids',
		type: 'multiOptions',
		default: [],
		required: true,
		description: 'The initiative labels to select. Choose from the list, or specify IDs using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
		typeOptions: {
			loadOptionsMethod: 'getInitiativeLabels',
		},
		displayOptions: {
			show: showFor,
		},
	},
];

export async function initiativeLabelRemoveFromInitiative(
	this: IExecuteFunctions,
): Promise<INodeExecutionData[]> {
	const slug = await getWorkspaceSlug(this);
	const initiativeId = rlcValue(this, 'initiativeId', 0);
	const labelIdsRaw = this.getNodeParameter('label_ids', 0);
	const label_ids = Array.isArray(labelIdsRaw) ? labelIdsRaw : (labelIdsRaw as string).split(',').map((id) => id.trim());

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
