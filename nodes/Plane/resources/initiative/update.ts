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
	resource: ['initiative'],
};

export const initiativeUpdateDescription: INodeProperties[] = [
	{
		displayName: 'Initiative ID',
		name: 'initiativeId',
		type: 'string',
		default: '',
		required: true,
		description: 'The ID of the initiative to update',
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
				displayName: 'Lead',
				name: 'lead',
				type: 'string',
				default: '',
				description: 'The UUID of the user who leads the initiative',
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
	const initiativeId = this.getNodeParameter('initiativeId', 0) as string;
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
