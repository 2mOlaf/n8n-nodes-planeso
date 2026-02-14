import type {
	IDataObject,
	IExecuteFunctions,
	INodeExecutionData,
	INodeProperties,
} from 'n8n-workflow';

import { API_ENDPOINTS } from '../../utils/constants';
import { getWorkspaceSlug, planeRequest, rlcValue } from '../../utils/helpers';
import { projectRlc, workItemRlc, propertyRlc } from '../../utils/rlcDefs';

const showFor = {
	operation: ['update'],
	resource: ['customPropertyValue'],
};

export const customPropertyValueUpdateDescription: INodeProperties[] = [
	projectRlc(showFor),
	workItemRlc(showFor),
	propertyRlc(showFor),
	{
		displayName: 'Value',
		name: 'value',
		type: 'string',
		default: '',
		required: true,
		description: 'The property value to set',
		displayOptions: {
			show: showFor,
		},
	},
];

export async function customPropertyValueUpdate(
	this: IExecuteFunctions,
): Promise<INodeExecutionData[]> {
	const slug = await getWorkspaceSlug(this);
	const projectId = rlcValue(this, 'projectId', 0);
	const workItemId = rlcValue(this, 'workItemId', 0);
	const propertyId = rlcValue(this, 'propertyId', 0);
	const value = this.getNodeParameter('value', 0) as string;

	const body: IDataObject = {
		value,
	};

	const response = await planeRequest.call(this, {
		method: 'PATCH',
		url: API_ENDPOINTS.CUSTOM_PROPERTY_VALUE(slug, projectId, workItemId, propertyId),
		body,
	});

	const results = Array.isArray(response) ? response : [response];
	return this.helpers.returnJsonArray(results);
}
