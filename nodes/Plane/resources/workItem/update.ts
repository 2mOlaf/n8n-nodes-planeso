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
	operation: ['update'],
	resource: ['workItem'],
};

export const workItemUpdateDescription: INodeProperties[] = [
	projectRlc(showFor),
	workItemRlc(showFor),
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
				displayName: 'Name',
				name: 'name',
				type: 'string',
				default: '',
				description: 'The name of the work item',
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

export async function workItemUpdate(
	this: IExecuteFunctions,
): Promise<INodeExecutionData[]> {
	const slug = await getWorkspaceSlug(this);
	const projectId = rlcValue(this, 'projectId', 0);
	const workItemId = rlcValue(this, 'workItemId', 0);
	const updateFields = this.getNodeParameter('updateFields', 0) as IDataObject;

	const body: IDataObject = {};

	if (updateFields.name) {
		body.name = updateFields.name;
	}
	if (updateFields.description_html) {
		body.description_html = updateFields.description_html;
	}
	if (updateFields.priority) {
		body.priority = updateFields.priority;
	}
	if (updateFields.state) {
		body.state = updateFields.state;
	}
	if (updateFields.assignees) {
		const val = updateFields.assignees;
		body.assignees = Array.isArray(val) ? val : (val as string).split(',').map((s) => s.trim());
	}
	if (updateFields.labels) {
		const val = updateFields.labels;
		body.labels = Array.isArray(val) ? val : (val as string).split(',').map((s) => s.trim());
	}
	if (updateFields.parent) {
		body.parent = updateFields.parent;
	}
	if (updateFields.estimate_point !== undefined) {
		body.estimate_point = updateFields.estimate_point;
	}
	if (updateFields.type) {
		body.type = updateFields.type;
	}
	if (updateFields.start_date) {
		body.start_date = updateFields.start_date;
	}
	if (updateFields.target_date) {
		body.target_date = updateFields.target_date;
	}

	const response = await planeRequest.call(this, {
		method: 'PATCH',
		url: API_ENDPOINTS.WORK_ITEM(slug, projectId, workItemId),
		body,
	});

	return this.helpers.returnJsonArray(Array.isArray(response) ? response : [response]);
}
