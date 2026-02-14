import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeProperties,
} from 'n8n-workflow';

import { API_ENDPOINTS } from '../../utils/constants';
import { getWorkspaceSlug, planeRequest } from '../../utils/helpers';

const showFor = {
	operation: ['delete'],
	resource: ['label'],
};

export const labelDeleteDescription: INodeProperties[] = [
	{
		displayName: 'Project ID',
		name: 'projectId',
		type: 'string',
		default: '',
		required: true,
		description: 'The ID of the project the label belongs to',
		displayOptions: {
			show: showFor,
		},
	},
	{
		displayName: 'Label ID',
		name: 'labelId',
		type: 'string',
		default: '',
		required: true,
		description: 'The ID of the label to delete',
		displayOptions: {
			show: showFor,
		},
	},
];

export async function labelDelete(
	this: IExecuteFunctions,
): Promise<INodeExecutionData[]> {
	const slug = await getWorkspaceSlug(this);
	const projectId = this.getNodeParameter('projectId', 0) as string;
	const labelId = this.getNodeParameter('labelId', 0) as string;

	await planeRequest.call(this, {
		method: 'DELETE',
		url: API_ENDPOINTS.LABEL(slug, projectId, labelId),
	});

	return this.helpers.returnJsonArray([{ success: true }]);
}
