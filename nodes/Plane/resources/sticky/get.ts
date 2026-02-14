import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeProperties,
} from 'n8n-workflow';

import { API_ENDPOINTS } from '../../utils/constants';
import { getWorkspaceSlug, planeRequest, rlcValue } from '../../utils/helpers';
import { stickyRlc } from '../../utils/rlcDefs';

const showFor = {
	operation: ['get'],
	resource: ['sticky'],
};

export const stickyGetDescription: INodeProperties[] = [
	stickyRlc(showFor),
];

export async function stickyGet(
	this: IExecuteFunctions,
): Promise<INodeExecutionData[]> {
	const slug = await getWorkspaceSlug(this);
	const stickyId = rlcValue(this, 'stickyId', 0);

	const response = await planeRequest.call(this, {
		method: 'GET',
		url: API_ENDPOINTS.STICKY(slug, stickyId),
	});

	const results = Array.isArray(response) ? response : [response];
	return this.helpers.returnJsonArray(results);
}
