import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeProperties,
} from 'n8n-workflow';

import { API_ENDPOINTS } from '../../utils/constants';
import { planeRequest, getWorkspaceSlug, rlcValue } from '../../utils/helpers';
import { intakeRlc } from '../../utils/rlcDefs';

const showFor = {
	operation: ['delete'],
	resource: ['intake'],
};

export const intakeDeleteDescription: INodeProperties[] = [
	intakeRlc(showFor),
];

export async function intakeDelete(
	this: IExecuteFunctions,
): Promise<INodeExecutionData[]> {
	const slug = await getWorkspaceSlug(this);
	const intakeId = rlcValue(this, 'intakeId', 0);

	await planeRequest.call(this, {
		method: 'DELETE',
		url: API_ENDPOINTS.INTAKE_ISSUE(slug, intakeId),
	});

	return this.helpers.returnJsonArray([{ success: true }]);
}
