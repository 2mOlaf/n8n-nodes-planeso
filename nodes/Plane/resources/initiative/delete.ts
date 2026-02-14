import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeProperties,
} from 'n8n-workflow';

import { API_ENDPOINTS } from '../../utils/constants';
import { getWorkspaceSlug, planeRequest, rlcValue } from '../../utils/helpers';
import { initiativeRlc } from '../../utils/rlcDefs';

const showFor = {
	operation: ['delete'],
	resource: ['initiative'],
};

export const initiativeDeleteDescription: INodeProperties[] = [
	initiativeRlc(showFor),
];

export async function initiativeDelete(
	this: IExecuteFunctions,
): Promise<INodeExecutionData[]> {
	const slug = await getWorkspaceSlug(this);
	const initiativeId = rlcValue(this, 'initiativeId', 0);

	await planeRequest.call(this, {
		method: 'DELETE',
		url: API_ENDPOINTS.INITIATIVE(slug, initiativeId),
	});

	return this.helpers.returnJsonArray([{ success: true }]);
}
