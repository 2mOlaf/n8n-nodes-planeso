import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeProperties,
} from 'n8n-workflow';

import { API_ENDPOINTS } from '../../utils/constants';
import { getWorkspaceSlug, planeRequest } from '../../utils/helpers';

const showFor = {
	operation: ['delete'],
	resource: ['initiativeLabel'],
};

export const initiativeLabelDeleteDescription: INodeProperties[] = [
	{
		displayName: 'Label ID',
		name: 'labelId',
		type: 'string',
		default: '',
		required: true,
		description: 'The ID of the initiative label to delete',
		displayOptions: {
			show: showFor,
		},
	},
];

export async function initiativeLabelDelete(
	this: IExecuteFunctions,
): Promise<INodeExecutionData[]> {
	const slug = await getWorkspaceSlug(this);
	const labelId = this.getNodeParameter('labelId', 0) as string;

	await planeRequest.call(this, {
		method: 'DELETE',
		url: API_ENDPOINTS.INITIATIVE_LABEL(slug, labelId),
	});

	return this.helpers.returnJsonArray([{ success: true }]);
}
