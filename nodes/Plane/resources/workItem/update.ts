import type {
	IDataObject,
	IExecuteFunctions,
	INodeExecutionData,
	INodeProperties,
} from 'n8n-workflow';

import { API_ENDPOINTS } from '../../utils/constants';
import { planeRequest, getWorkspaceSlug } from '../../utils/helpers';

const showFor = {
	operation: ['update'],
	resource: ['workItem'],
};

export const workItemUpdateDescription: INodeProperties[] = [
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
		description: 'The ID of the work item to update',
		displayOptions: {
			show: showFor,
		},
	},
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
				displayName: 'Assignees',
				name: 'assignees',
				type: 'string',
				default: '',
				description: 'Comma-separated list of user UUIDs to assign',
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
				displayName: 'Labels',
				name: 'labels',
				type: 'string',
				default: '',
				description: 'Comma-separated list of label UUIDs',
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
				displayName: 'State',
				name: 'state',
				type: 'string',
				default: '',
				description: 'The state ID of the work item',
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
				displayName: 'Type',
				name: 'type',
				type: 'string',
				default: '',
				description: 'The work item type ID',
			},
		],
	},
];

export async function workItemUpdate(
	this: IExecuteFunctions,
): Promise<INodeExecutionData[]> {
	const slug = await getWorkspaceSlug(this);
	const projectId = this.getNodeParameter('projectId', 0) as string;
	const workItemId = this.getNodeParameter('workItemId', 0) as string;
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
		body.assignees = (updateFields.assignees as string).split(',').map((s) => s.trim());
	}
	if (updateFields.labels) {
		body.labels = (updateFields.labels as string).split(',').map((s) => s.trim());
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
