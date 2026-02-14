import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeProperties,
} from 'n8n-workflow';

import { API_ENDPOINTS } from '../../utils/constants';
import { planeRequest, getWorkspaceSlug, rlcValue } from '../../utils/helpers';
import { intakeRlc } from '../../utils/rlcDefs';

const showFor = {
	operation: ['get'],
	resource: ['intake'],
};

export const intakeGetDescription: INodeProperties[] = [
	intakeRlc(showFor),
];

export async function intakeGet(
	this: IExecuteFunctions,
): Promise<INodeExecutionData[]> {
	const slug = await getWorkspaceSlug(this);
	const intakeId = rlcValue(this, 'intakeId', 0);

	const response = await planeRequest.call(this, {
		method: 'GET',
		url: API_ENDPOINTS.INTAKE_ISSUE(slug, intakeId),
	});

	return this.helpers.returnJsonArray(Array.isArray(response) ? response : [response]);
}
