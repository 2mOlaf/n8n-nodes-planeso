import type {
	IDataObject,
	IExecuteFunctions,
	INodeExecutionData,
	INodeProperties,
} from 'n8n-workflow';

import { API_ENDPOINTS } from '../../utils/constants';
import { planeRequest, getWorkspaceSlug, rlcValue } from '../../utils/helpers';
import { projectRlc, moduleRlc } from '../../utils/rlcDefs';

const showFor = {
	operation: ['update'],
	resource: ['module'],
};

export const moduleUpdateDescription: INodeProperties[] = [
	projectRlc(showFor),
	moduleRlc(showFor),
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
				displayName: 'Lead Name or ID',
				name: 'lead',
				type: 'options',
				default: '',
				description: 'The user who leads this. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
				typeOptions: {
					loadOptionsMethod: 'getMembers',
				},
			},
			{
				displayName: 'Member Names or IDs',
				name: 'members',
				type: 'multiOptions',
				default: [],
				description: 'Users to add as members. Choose from the list, or specify IDs using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
				typeOptions: {
					loadOptionsMethod: 'getMembers',
				},
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
	const projectId = rlcValue(this, 'projectId', 0);
	const moduleId = rlcValue(this, 'moduleId', 0);
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
		const val = updateFields.members;
		body.members = Array.isArray(val) ? val : (val as string).split(',').map((s) => s.trim());
	}

	const response = await planeRequest.call(this, {
		method: 'PATCH',
		url: API_ENDPOINTS.MODULE(slug, projectId, moduleId),
		body,
	});

	return this.helpers.returnJsonArray(Array.isArray(response) ? response : [response]);
}
