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
	resource: ['module'],
};

export const moduleCreateDescription: INodeProperties[] = [
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
		displayName: 'Name',
		name: 'name',
		type: 'string',
		default: '',
		required: true,
		description: 'The name of the module',
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

export async function moduleCreate(
	this: IExecuteFunctions,
): Promise<INodeExecutionData[]> {
	const slug = await getWorkspaceSlug(this);
	const projectId = this.getNodeParameter('projectId', 0) as string;
	const name = this.getNodeParameter('name', 0) as string;
	const additionalFields = this.getNodeParameter('additionalFields', 0) as IDataObject;

	const body: IDataObject = {
		name,
	};

	if (additionalFields.description) {
		body.description = additionalFields.description;
	}
	if (additionalFields.start_date) {
		body.start_date = additionalFields.start_date;
	}
	if (additionalFields.target_date) {
		body.target_date = additionalFields.target_date;
	}
	if (additionalFields.status) {
		body.status = additionalFields.status;
	}
	if (additionalFields.lead) {
		body.lead = additionalFields.lead;
	}
	if (additionalFields.members) {
		body.members = (additionalFields.members as string).split(',').map((s) => s.trim());
	}

	const response = await planeRequest.call(this, {
		method: 'POST',
		url: API_ENDPOINTS.MODULES(slug, projectId),
		body,
	});

	return this.helpers.returnJsonArray(Array.isArray(response) ? response : [response]);
}
