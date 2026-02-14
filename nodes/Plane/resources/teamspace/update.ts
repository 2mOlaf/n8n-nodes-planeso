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
	resource: ['teamspace'],
};

export const teamspaceUpdateDescription: INodeProperties[] = [
	{
		displayName: 'Teamspace ID',
		name: 'teamspaceId',
		type: 'string',
		default: '',
		required: true,
		description: 'The ID of the teamspace to update',
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
				description: 'The HTML description of the teamspace',
			},
			{
				displayName: 'Lead',
				name: 'lead',
				type: 'string',
				default: '',
				description: 'The UUID of the user who leads the teamspace',
			},
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				default: '',
				description: 'The name of the teamspace',
			},
		],
	},
];

export async function teamspaceUpdate(
	this: IExecuteFunctions,
): Promise<INodeExecutionData[]> {
	const slug = await getWorkspaceSlug(this);
	const teamspaceId = this.getNodeParameter('teamspaceId', 0) as string;
	const updateFields = this.getNodeParameter('updateFields', 0) as IDataObject;

	const body: IDataObject = {
		...updateFields,
	};

	const response = await planeRequest.call(this, {
		method: 'PATCH',
		url: API_ENDPOINTS.TEAMSPACE(slug, teamspaceId),
		body,
	});

	const results = Array.isArray(response) ? response : [response];
	return this.helpers.returnJsonArray(results);
}
