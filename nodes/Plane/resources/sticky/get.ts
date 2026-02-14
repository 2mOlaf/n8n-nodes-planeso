import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeProperties,
} from 'n8n-workflow';

import { API_ENDPOINTS } from '../../utils/constants';
import { getWorkspaceSlug, planeRequest } from '../../utils/helpers';

const showFor = {
	operation: ['get'],
	resource: ['sticky'],
};

export const stickyGetDescription: INodeProperties[] = [
	{
		displayName: 'Sticky ID',
		name: 'stickyId',
		type: 'string',
		default: '',
		required: true,
		description: 'The ID of the sticky to retrieve',
		displayOptions: {
			show: showFor,
		},
	},
];

export async function stickyGet(
	this: IExecuteFunctions,
): Promise<INodeExecutionData[]> {
	const slug = await getWorkspaceSlug(this);
	const stickyId = this.getNodeParameter('stickyId', 0) as string;

	const response = await planeRequest.call(this, {
		method: 'GET',
		url: API_ENDPOINTS.STICKY(slug, stickyId),
	});

	const results = Array.isArray(response) ? response : [response];
	return this.helpers.returnJsonArray(results);
}
