import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeProperties,
} from 'n8n-workflow';

import { API_ENDPOINTS } from '../../utils/constants';
import { planeRequest, getWorkspaceSlug } from '../../utils/helpers';

const showFor = {
	operation: ['get'],
	resource: ['workItemActivity'],
};

export const workItemActivityGetDescription: INodeProperties[] = [
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
		displayName: 'Work Item ID',
		name: 'workItemId',
		type: 'string',
		default: '',
		required: true,
		description: 'The ID of the work item',
		displayOptions: {
			show: showFor,
		},
	},
	{
		displayName: 'Activity ID',
		name: 'activityId',
		type: 'string',
		default: '',
		required: true,
		description: 'The ID of the activity',
		displayOptions: {
			show: showFor,
		},
	},
];

export async function workItemActivityGet(
	this: IExecuteFunctions,
): Promise<INodeExecutionData[]> {
	const slug = await getWorkspaceSlug(this);
	const projectId = this.getNodeParameter('projectId', 0) as string;
	const workItemId = this.getNodeParameter('workItemId', 0) as string;
	const activityId = this.getNodeParameter('activityId', 0) as string;

	const response = await planeRequest.call(this, {
		method: 'GET',
		url: API_ENDPOINTS.WORK_ITEM_ACTIVITY(slug, projectId, workItemId, activityId),
	});

	return this.helpers.returnJsonArray(Array.isArray(response) ? response : [response]);
}
