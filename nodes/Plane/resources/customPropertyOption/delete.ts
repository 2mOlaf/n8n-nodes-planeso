import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeProperties,
} from 'n8n-workflow';

import { API_ENDPOINTS } from '../../utils/constants';
import { getWorkspaceSlug, planeRequest, rlcValue } from '../../utils/helpers';
import { projectRlc, propertyRlc, optionRlc } from '../../utils/rlcDefs';

const showFor = {
	operation: ['delete'],
	resource: ['customPropertyOption'],
};

export const customPropertyOptionDeleteDescription: INodeProperties[] = [
	projectRlc(showFor),
	propertyRlc(showFor),
	optionRlc(showFor),
];

export async function customPropertyOptionDelete(
	this: IExecuteFunctions,
): Promise<INodeExecutionData[]> {
	const slug = await getWorkspaceSlug(this);
	const projectId = rlcValue(this, 'projectId', 0);
	const propertyId = rlcValue(this, 'propertyId', 0);
	const optionId = rlcValue(this, 'optionId', 0);

	await planeRequest.call(this, {
		method: 'DELETE',
		url: API_ENDPOINTS.CUSTOM_PROPERTY_OPTION(slug, projectId, propertyId, optionId),
	});

	return this.helpers.returnJsonArray([{ success: true }]);
}
