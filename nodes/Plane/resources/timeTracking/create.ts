import type {
	IDataObject,
	IExecuteFunctions,
	INodeExecutionData,
	INodeProperties,
} from 'n8n-workflow';

import { API_ENDPOINTS } from '../../utils/constants';
import { planeRequest, getWorkspaceSlug } from '../../utils/helpers';

const showFor = {
	operation: ['create'],
	resource: ['timeTracking'],
};

export const timeTrackingCreateDescription: INodeProperties[] = [
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
		displayName: 'Description',
		name: 'description',
		type: 'string',
		default: '',
		required: true,
		description: 'The description of the worklog entry',
		displayOptions: {
			show: showFor,
		},
	},
	{
		displayName: 'Duration (Minutes)',
		name: 'duration',
		type: 'number',
		default: 0,
		required: true,
		description: 'The duration of the worklog entry in minutes',
		displayOptions: {
			show: showFor,
		},
	},
];

export async function timeTrackingCreate(
	this: IExecuteFunctions,
): Promise<INodeExecutionData[]> {
	const slug = await getWorkspaceSlug(this);
	const projectId = this.getNodeParameter('projectId', 0) as string;
	const workItemId = this.getNodeParameter('workItemId', 0) as string;
	const description = this.getNodeParameter('description', 0) as string;
	const duration = this.getNodeParameter('duration', 0) as number;

	const body: IDataObject = {
		description,
		duration,
	};

	const response = await planeRequest.call(this, {
		method: 'POST',
		url: API_ENDPOINTS.WORKLOGS(slug, projectId, workItemId),
		body,
	});

	return this.helpers.returnJsonArray(Array.isArray(response) ? response : [response]);
}
