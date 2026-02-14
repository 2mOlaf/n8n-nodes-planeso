import type {
	IDataObject,
	IExecuteFunctions,
	INodeExecutionData,
	INodeProperties,
} from 'n8n-workflow';

import { API_ENDPOINTS } from '../../utils/constants';
import { planeRequest, getWorkspaceSlug, rlcValue } from '../../utils/helpers';
import { projectRlc, workItemRlc } from '../../utils/rlcDefs';

const showFor = {
	operation: ['create'],
	resource: ['timeTracking'],
};

export const timeTrackingCreateDescription: INodeProperties[] = [
	projectRlc(showFor),
	workItemRlc(showFor),
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
	const projectId = rlcValue(this, 'projectId', 0);
	const workItemId = rlcValue(this, 'workItemId', 0);
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
