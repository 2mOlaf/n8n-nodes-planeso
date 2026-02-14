import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeProperties,
} from 'n8n-workflow';

import { API_ENDPOINTS } from '../../utils/constants';
import { getWorkspaceSlug, planeRequest } from '../../utils/helpers';

const showFor = {
	operation: ['delete'],
	resource: ['sticky'],
};

export const stickyDeleteDescription: INodeProperties[] = [
	{
		displayName: 'Sticky ID',
		name: 'stickyId',
		type: 'string',
		default: '',
		required: true,
		description: 'The ID of the sticky to delete',
		displayOptions: {
			show: showFor,
		},
	},
];

export async function stickyDelete(
	this: IExecuteFunctions,
): Promise<INodeExecutionData[]> {
	const slug = await getWorkspaceSlug(this);
	const stickyId = this.getNodeParameter('stickyId', 0) as string;

	await planeRequest.call(this, {
		method: 'DELETE',
		url: API_ENDPOINTS.STICKY(slug, stickyId),
	});

	return this.helpers.returnJsonArray([{ success: true }]);
}
