import type {
	IDataObject,
	IExecuteFunctions,
	INodeExecutionData,
	INodeProperties,
} from 'n8n-workflow';

import { API_ENDPOINTS } from '../../utils/constants';
import { getWorkspaceSlug, planeRequest, rlcValue } from '../../utils/helpers';
import { projectRlc, stateRlc } from '../../utils/rlcDefs';

const showFor = {
	operation: ['update'],
	resource: ['state'],
};

export const stateUpdateDescription: INodeProperties[] = [
	projectRlc(showFor),
	stateRlc(showFor),
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
	const projectId = rlcValue(this, 'projectId', 0);
	const stateId = rlcValue(this, 'stateId', 0);
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
