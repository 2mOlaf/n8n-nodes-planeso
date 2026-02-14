import type {
	IDataObject,
	IExecuteFunctions,
	INodeExecutionData,
	INodeProperties,
} from 'n8n-workflow';

import { API_ENDPOINTS } from '../../utils/constants';
import { getWorkspaceSlug, planeRequest, rlcValue } from '../../utils/helpers';
import { initiativeRlc } from '../../utils/rlcDefs';

const showFor = {
	operation: ['update'],
	resource: ['initiative'],
};

export const initiativeUpdateDescription: INodeProperties[] = [
	initiativeRlc(showFor),
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
				displayName: 'Description HTML',
				name: 'description_html',
				type: 'string',
				default: '',
				description: 'The HTML description of the initiative',
			},
			{
				displayName: 'End Date',
				name: 'end_date',
				type: 'string',
				default: '',
				description: 'The end date of the initiative (YYYY-MM-DD)',
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
				displayName: 'Name',
				name: 'name',
				type: 'string',
				default: '',
				description: 'The name of the initiative',
			},
			{
				displayName: 'Start Date',
				name: 'start_date',
				type: 'string',
				default: '',
				description: 'The start date of the initiative (YYYY-MM-DD)',
			},
			{
				displayName: 'State',
				name: 'state',
				type: 'options',
				default: 'DRAFT',
				options: [
					{
						name: 'Active',
						value: 'ACTIVE',
					},
					{
						name: 'Closed',
						value: 'CLOSED',
					},
					{
						name: 'Completed',
						value: 'COMPLETED',
					},
					{
						name: 'Draft',
						value: 'DRAFT',
					},
					{
						name: 'Planned',
						value: 'PLANNED',
					},
				],
				description: 'The state of the initiative',
			},
		],
	},
];

export async function initiativeUpdate(
	this: IExecuteFunctions,
): Promise<INodeExecutionData[]> {
	const slug = await getWorkspaceSlug(this);
	const initiativeId = rlcValue(this, 'initiativeId', 0);
	const updateFields = this.getNodeParameter('updateFields', 0) as IDataObject;

	const body: IDataObject = {
		...updateFields,
	};

	const response = await planeRequest.call(this, {
		method: 'PATCH',
		url: API_ENDPOINTS.INITIATIVE(slug, initiativeId),
		body,
	});

	return this.helpers.returnJsonArray(Array.isArray(response) ? response : [response]);
}
