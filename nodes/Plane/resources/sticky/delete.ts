import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeProperties,
} from 'n8n-workflow';

import { API_ENDPOINTS } from '../../utils/constants';
import { getWorkspaceSlug, planeRequest, rlcValue } from '../../utils/helpers';
import { stickyRlc } from '../../utils/rlcDefs';

const showFor = {
	operation: ['delete'],
	resource: ['sticky'],
};

export const stickyDeleteDescription: INodeProperties[] = [
	stickyRlc(showFor),
];

export async function stickyDelete(
	this: IExecuteFunctions,
): Promise<INodeExecutionData[]> {
	const slug = await getWorkspaceSlug(this);
	const stickyId = rlcValue(this, 'stickyId', 0);

	await planeRequest.call(this, {
		method: 'DELETE',
		url: API_ENDPOINTS.STICKY(slug, stickyId),
	});

	return this.helpers.returnJsonArray([{ success: true }]);
}
