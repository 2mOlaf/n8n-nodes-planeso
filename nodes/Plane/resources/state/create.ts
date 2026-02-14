import type {
	IDataObject,
	IExecuteFunctions,
	INodeExecutionData,
	INodeProperties,
} from 'n8n-workflow';

import { API_ENDPOINTS } from '../../utils/constants';
import { getWorkspaceSlug, planeRequest, rlcValue } from '../../utils/helpers';
import { projectRlc } from '../../utils/rlcDefs';

const showFor = {
	operation: ['create'],
	resource: ['state'],
};

export const stateCreateDescription: INodeProperties[] = [
	projectRlc(showFor),
	{
		displayName: 'Name',
		name: 'name',
		type: 'string',
		default: '',
		required: true,
		description: 'The name of the state',
		displayOptions: {
			show: showFor,
		},
	},
	{
		displayName: 'Color',
		name: 'color',
		type: 'color',
		default: '#ff0000',
		required: true,
		description: 'The color of the state in hex format (e.g. #ff0000)',
		displayOptions: {
			show: showFor,
		},
	},
	{
		displayName: 'Group',
		name: 'group',
		type: 'options',
		default: 'backlog',
		required: true,
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
				description: 'The description of the state',
			},
		],
	},
];

export async function stateCreate(
	this: IExecuteFunctions,
): Promise<INodeExecutionData[]> {
	const slug = await getWorkspaceSlug(this);
	const projectId = rlcValue(this, 'projectId', 0);
	const name = this.getNodeParameter('name', 0) as string;
	const color = this.getNodeParameter('color', 0) as string;
	const group = this.getNodeParameter('group', 0) as string;
	const additionalFields = this.getNodeParameter('additionalFields', 0) as IDataObject;

	const body: IDataObject = {
		name,
		color,
		group,
		...additionalFields,
	};

	const response = await planeRequest.call(this, {
		method: 'POST',
		url: API_ENDPOINTS.STATES(slug, projectId),
		body,
	});

	const results = Array.isArray(response) ? response : [response];
	return this.helpers.returnJsonArray(results);
}
