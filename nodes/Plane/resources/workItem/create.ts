import type {
	IDataObject,
	IExecuteFunctions,
	INodeExecutionData,
	INodeProperties,
} from 'n8n-workflow';

import { API_ENDPOINTS } from '../../utils/constants';
import { planeRequest, getWorkspaceSlug, rlcValue } from '../../utils/helpers';
import { projectRlc } from '../../utils/rlcDefs';

const showFor = {
	operation: ['create'],
	resource: ['workItem'],
};

export const workItemCreateDescription: INodeProperties[] = [
	projectRlc(showFor),
	{
		displayName: 'Name',
		name: 'name',
		type: 'string',
		default: '',
		required: true,
		description: 'The name of the work item',
		displayOptions: {
			show: showFor,
		},
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: showFor,
		},
		options: [
			{
				displayName: 'Assignee Names or IDs',
				name: 'assignees',
				type: 'multiOptions',
				default: [],
				description: 'Users to assign to the work item. Choose from the list, or specify IDs using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
				typeOptions: {
					loadOptionsMethod: 'getMembers',
				},
			},
			{
				displayName: 'Description HTML',
				name: 'description_html',
				type: 'string',
				default: '',
				description: 'The description of the work item in HTML format',
			},
			{
				displayName: 'Estimate Point',
				name: 'estimate_point',
				type: 'number',
				default: 0,
				description: 'The estimate point value',
			},
			{
				displayName: 'Label Names or IDs',
				name: 'labels',
				type: 'multiOptions',
				default: [],
				description: 'Labels to add to the work item. Choose from the list, or specify IDs using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
				typeOptions: {
					loadOptionsMethod: 'getLabels',
				},
			},
			{
				displayName: 'Parent',
				name: 'parent',
				type: 'string',
				default: '',
				description: 'The ID of the parent work item',
			},
			{
				displayName: 'Priority',
				name: 'priority',
				type: 'options',
				default: 'none',
				options: [
					{ name: 'High', value: 'high' },
					{ name: 'Low', value: 'low' },
					{ name: 'Medium', value: 'medium' },
					{ name: 'None', value: 'none' },
					{ name: 'Urgent', value: 'urgent' },
				],
				description: 'The priority of the work item',
			},
			{
				displayName: 'Start Date',
				name: 'start_date',
				type: 'string',
				default: '',
				placeholder: 'YYYY-MM-DD',
				description: 'The start date of the work item',
			},
			{
				displayName: 'State Name or ID',
				name: 'state',
				type: 'options',
				default: '',
				description: 'The state of the work item. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
				typeOptions: {
					loadOptionsMethod: 'getStates',
				},
			},
			{
				displayName: 'Target Date',
				name: 'target_date',
				type: 'string',
				default: '',
				placeholder: 'YYYY-MM-DD',
				description: 'The target date of the work item',
			},
			{
				displayName: 'Type Name or ID',
				name: 'type',
				type: 'options',
				default: '',
				description: 'The work item type. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
				typeOptions: {
					loadOptionsMethod: 'getWorkItemTypes',
				},
			},
		],
	},
];

export async function workItemCreate(
	this: IExecuteFunctions,
): Promise<INodeExecutionData[]> {
	const slug = await getWorkspaceSlug(this);
	const projectId = rlcValue(this, 'projectId', 0);
	const name = this.getNodeParameter('name', 0) as string;
	const additionalFields = this.getNodeParameter('additionalFields', 0) as IDataObject;

	const body: IDataObject = {
		name,
	};

	if (additionalFields.description_html) {
		body.description_html = additionalFields.description_html;
	}
	if (additionalFields.priority) {
		body.priority = additionalFields.priority;
	}
	if (additionalFields.state) {
		body.state = additionalFields.state;
	}
	if (additionalFields.assignees) {
		const val = additionalFields.assignees;
		body.assignees = Array.isArray(val) ? val : (val as string).split(',').map((s) => s.trim());
	}
	if (additionalFields.labels) {
		const val = additionalFields.labels;
		body.labels = Array.isArray(val) ? val : (val as string).split(',').map((s) => s.trim());
	}
	if (additionalFields.parent) {
		body.parent = additionalFields.parent;
	}
	if (additionalFields.estimate_point !== undefined) {
		body.estimate_point = additionalFields.estimate_point;
	}
	if (additionalFields.type) {
		body.type = additionalFields.type;
	}
	if (additionalFields.start_date) {
		body.start_date = additionalFields.start_date;
	}
	if (additionalFields.target_date) {
		body.target_date = additionalFields.target_date;
	}

	const response = await planeRequest.call(this, {
		method: 'POST',
		url: API_ENDPOINTS.WORK_ITEMS(slug, projectId),
		body,
	});

	return this.helpers.returnJsonArray(Array.isArray(response) ? response : [response]);
}
