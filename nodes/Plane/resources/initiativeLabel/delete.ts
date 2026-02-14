import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeProperties,
} from 'n8n-workflow';

import { API_ENDPOINTS } from '../../utils/constants';
import { getWorkspaceSlug, planeRequest, rlcValue } from '../../utils/helpers';
import { initiativeLabelRlc } from '../../utils/rlcDefs';

const showFor = {
	operation: ['delete'],
	resource: ['initiativeLabel'],
};

export const initiativeLabelDeleteDescription: INodeProperties[] = [
	initiativeLabelRlc(showFor),
];

export async function initiativeLabelDelete(
	this: IExecuteFunctions,
): Promise<INodeExecutionData[]> {
	const slug = await getWorkspaceSlug(this);
	const labelId = rlcValue(this, 'labelId', 0);

	await planeRequest.call(this, {
		method: 'DELETE',
		url: API_ENDPOINTS.INITIATIVE_LABEL(slug, labelId),
	});

	return this.helpers.returnJsonArray([{ success: true }]);
}
