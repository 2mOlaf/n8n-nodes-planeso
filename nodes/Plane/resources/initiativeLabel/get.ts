import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeProperties,
} from 'n8n-workflow';

import { API_ENDPOINTS } from '../../utils/constants';
import { getWorkspaceSlug, planeRequest } from '../../utils/helpers';

const showFor = {
	operation: ['get'],
	resource: ['initiativeLabel'],
};

export const initiativeLabelGetDescription: INodeProperties[] = [
	{
		displayName: 'Label ID',
		name: 'labelId',
		type: 'string',
		default: '',
		required: true,
		description: 'The ID of the initiative label to retrieve',
		displayOptions: {
			show: showFor,
		},
	},
];

export async function initiativeLabelGet(
	this: IExecuteFunctions,
): Promise<INodeExecutionData[]> {
	const slug = await getWorkspaceSlug(this);
	const labelId = this.getNodeParameter('labelId', 0) as string;

	const response = await planeRequest.call(this, {
		method: 'GET',
		url: API_ENDPOINTS.INITIATIVE_LABEL(slug, labelId),
	});

	return this.helpers.returnJsonArray(Array.isArray(response) ? response : [response]);
}
