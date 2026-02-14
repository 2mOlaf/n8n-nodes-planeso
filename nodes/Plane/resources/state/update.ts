import type {
	IDataObject,
	IExecuteFunctions,
	INodeExecutionData,
	INodeProperties,
} from 'n8n-workflow';

import { API_ENDPOINTS } from '../../utils/constants';
import { getWorkspaceSlug, planeRequest } from '../../utils/helpers';

const showFor = {
	operation: ['update'],
	resource: ['state'],
};

export const stateUpdateDescription: INodeProperties[] = [
	{
		displayName: 'Project ID',
		name: 'projectId',
		type: 'string',
		default: '',
		required: true,
		description: 'The ID of the project the state belongs to',
		displayOptions: {
			show: showFor,
		},
	},
	{
		displayName: 'State ID',
		name: 'stateId',
		type: 'string',
		default: '',
		required: true,
		description: 'The ID of the state to update',
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
				displayName: 'Color',
				name: 'color',
				type: 'color',
				default: '',
				description: 'The color of the state in hex format (e.g. #ff0000)',
			},
			{
				displayName: 'Description',
				name: 'description',
				type: 'string',
				default: '',
				description: 'The description of the state',
			},
			{
				displayName: 'Group',
				name: 'group',
				type: 'options',
				default: 'backlog',
				options: [
					{
						name: 'Backlog',
						value: 'backlog',
					},
					{
						name: 'Cancelled',
						value: 'cancelled',
					},
					{
						name: 'Completed',
						value: 'completed',
					},
					{
						name: 'Started',
						value: 'started',
					},
					{
						name: 'Unstarted',
						value: 'unstarted',
					},
				],
				description: 'The group the state belongs to',
			},
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				default: '',
				description: 'The name of the state',
			},
		],
	},
];

export async function stateUpdate(
	this: IExecuteFunctions,
): Promise<INodeExecutionData[]> {
	const slug = await getWorkspaceSlug(this);
	const projectId = this.getNodeParameter('projectId', 0) as string;
	const stateId = this.getNodeParameter('stateId', 0) as string;
	const updateFields = this.getNodeParameter('updateFields', 0) as IDataObject;

	const body: IDataObject = {
		...updateFields,
	};

	const response = await planeRequest.call(this, {
		method: 'PATCH',
		url: API_ENDPOINTS.STATE(slug, projectId, stateId),
		body,
	});

	const results = Array.isArray(response) ? response : [response];
	return this.helpers.returnJsonArray(results);
}
