import type {
	IDataObject,
	IExecuteFunctions,
	INodeExecutionData,
	INodeProperties,
} from 'n8n-workflow';

import { API_ENDPOINTS } from '../../utils/constants';
import { planeRequest, getWorkspaceSlug, rlcValue } from '../../utils/helpers';
import { projectRlc, workItemRlc, timeTrackingRlc } from '../../utils/rlcDefs';

const showFor = {
	operation: ['update'],
	resource: ['timeTracking'],
};

export const timeTrackingUpdateDescription: INodeProperties[] = [
	projectRlc(showFor),
	workItemRlc(showFor),
	timeTrackingRlc(showFor),
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: showFor,
		},
		options: [
			{
				displayName: 'Description',
				name: 'description',
				type: 'string',
				default: '',
				description: 'The description of the worklog entry',
			},
			{
				displayName: 'Duration (Minutes)',
				name: 'duration',
				type: 'number',
				default: 0,
				description: 'The duration of the worklog entry in minutes',
			},
		],
	},
];

export async function timeTrackingUpdate(
	this: IExecuteFunctions,
): Promise<INodeExecutionData[]> {
	const slug = await getWorkspaceSlug(this);
	const projectId = rlcValue(this, 'projectId', 0);
	const workItemId = rlcValue(this, 'workItemId', 0);
	const worklogId = rlcValue(this, 'worklogId', 0);
	const updateFields = this.getNodeParameter('updateFields', 0) as IDataObject;

	const body: IDataObject = {
		...updateFields,
	};

	const response = await planeRequest.call(this, {
		method: 'PATCH',
		url: API_ENDPOINTS.WORKLOG(slug, projectId, workItemId, worklogId),
		body,
	});

	return this.helpers.returnJsonArray(Array.isArray(response) ? response : [response]);
}
