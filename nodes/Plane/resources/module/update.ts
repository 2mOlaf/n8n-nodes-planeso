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
	resource: ['module'],
};

export const moduleUpdateDescription: INodeProperties[] = [
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
		displayName: 'Module ID',
		name: 'moduleId',
		type: 'string',
		default: '',
		required: true,
		description: 'The ID of the module to update',
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
				displayName: 'Description',
				name: 'description',
				type: 'string',
				default: '',
				description: 'The description of the module',
			},
			{
				displayName: 'Lead',
				name: 'lead',
				type: 'string',
				default: '',
				description: 'The UUID of the user who leads the module',
			},
			{
				displayName: 'Members',
				name: 'members',
				type: 'string',
				default: '',
				description: 'Comma-separated list of user UUIDs to add as members',
			},
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				default: '',
				description: 'The name of the module',
			},
			{
				displayName: 'Start Date',
				name: 'start_date',
				type: 'string',
				default: '',
				placeholder: 'YYYY-MM-DD',
				description: 'The start date of the module',
			},
			{
				displayName: 'Status',
				name: 'status',
				type: 'options',
				default: 'backlog',
				options: [
					{ name: 'Backlog', value: 'backlog' },
					{ name: 'Cancelled', value: 'cancelled' },
					{ name: 'Completed', value: 'completed' },
					{ name: 'In Progress', value: 'in-progress' },
					{ name: 'Paused', value: 'paused' },
					{ name: 'Planned', value: 'planned' },
				],
				description: 'The status of the module',
			},
			{
				displayName: 'Target Date',
				name: 'target_date',
				type: 'string',
				default: '',
				placeholder: 'YYYY-MM-DD',
				description: 'The target date of the module',
			},
		],
	},
];

export async function moduleUpdate(
	this: IExecuteFunctions,
): Promise<INodeExecutionData[]> {
	const slug = await getWorkspaceSlug(this);
	const projectId = this.getNodeParameter('projectId', 0) as string;
	const moduleId = this.getNodeParameter('moduleId', 0) as string;
	const updateFields = this.getNodeParameter('updateFields', 0) as IDataObject;

	const body: IDataObject = {};

	if (updateFields.name) {
		body.name = updateFields.name;
	}
	if (updateFields.description) {
		body.description = updateFields.description;
	}
	if (updateFields.start_date) {
		body.start_date = updateFields.start_date;
	}
	if (updateFields.target_date) {
		body.target_date = updateFields.target_date;
	}
	if (updateFields.status) {
		body.status = updateFields.status;
	}
	if (updateFields.lead) {
		body.lead = updateFields.lead;
	}
	if (updateFields.members) {
		body.members = (updateFields.members as string).split(',').map((s) => s.trim());
	}

	const response = await planeRequest.call(this, {
		method: 'PATCH',
		url: API_ENDPOINTS.MODULE(slug, projectId, moduleId),
		body,
	});

	return this.helpers.returnJsonArray(Array.isArray(response) ? response : [response]);
}
