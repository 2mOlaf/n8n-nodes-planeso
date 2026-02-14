import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeProperties,
} from 'n8n-workflow';

import { API_ENDPOINTS } from '../../utils/constants';
import { planeRequest, getWorkspaceSlug } from '../../utils/helpers';

const showFor = {
	operation: ['get'],
	resource: ['workItemType'],
};

export const workItemTypeGetDescription: INodeProperties[] = [
	{
		displayName: 'Project ID',
		name: 'projectId',
		type: 'string',
		default: '',
		required: true,
		description: 'The ID of the project',
		displayOptions: {
			show: showFor,
		},
	},
	{
		displayName: 'Type ID',
		name: 'typeId',
		type: 'string',
		default: '',
		required: true,
		description: 'The ID of the work item type',
		displayOptions: {
			show: showFor,
		},
	},
];

export async function workItemTypeGet(
	this: IExecuteFunctions,
): Promise<INodeExecutionData[]> {
	const slug = await getWorkspaceSlug(this);
	const projectId = this.getNodeParameter('projectId', 0) as string;
	const typeId = this.getNodeParameter('typeId', 0) as string;

	const response = await planeRequest.call(this, {
		method: 'GET',
		url: API_ENDPOINTS.WORK_ITEM_TYPE(slug, projectId, typeId),
	});

	return this.helpers.returnJsonArray(Array.isArray(response) ? response : [response]);
}
