import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeProperties,
} from 'n8n-workflow';

import { API_ENDPOINTS } from '../../utils/constants';
import { getWorkspaceSlug, planeRequest, rlcValue } from '../../utils/helpers';
import { initiativeLabelRlc } from '../../utils/rlcDefs';

const showFor = {
	operation: ['get'],
	resource: ['initiativeLabel'],
};

export const initiativeLabelGetDescription: INodeProperties[] = [
	initiativeLabelRlc(showFor),
];

export async function initiativeLabelGet(
	this: IExecuteFunctions,
): Promise<INodeExecutionData[]> {
	const slug = await getWorkspaceSlug(this);
	const labelId = rlcValue(this, 'labelId', 0);

	const response = await planeRequest.call(this, {
		method: 'GET',
		url: API_ENDPOINTS.INITIATIVE_LABEL(slug, labelId),
	});

	return this.helpers.returnJsonArray(Array.isArray(response) ? response : [response]);
}
