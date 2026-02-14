import type {
	IDataObject,
	IExecuteFunctions,
	INodeExecutionData,
	INodeProperties,
} from 'n8n-workflow';

import { API_ENDPOINTS } from '../../utils/constants';
import { getWorkspaceSlug, planeRequest } from '../../utils/helpers';

const showFor = {
	operation: ['add'],
	resource: ['initiativeProject'],
};

export const initiativeProjectAddDescription: INodeProperties[] = [
	{
		displayName: 'Initiative ID',
		name: 'initiativeId',
		type: 'string',
		default: '',
		required: true,
		description: 'The ID of the initiative to add projects to',
		displayOptions: {
			show: showFor,
		},
	},
	{
		displayName: 'Project IDs',
		name: 'project_ids',
		type: 'string',
		default: '',
		required: true,
		description: 'Comma-separated list of project UUIDs to add to the initiative',
		displayOptions: {
			show: showFor,
		},
	},
];

export async function initiativeProjectAdd(
	this: IExecuteFunctions,
): Promise<INodeExecutionData[]> {
	const slug = await getWorkspaceSlug(this);
	const initiativeId = this.getNodeParameter('initiativeId', 0) as string;
	const projectIdsRaw = this.getNodeParameter('project_ids', 0) as string;
	const project_ids = projectIdsRaw.split(',').map((id) => id.trim());

	const body: IDataObject = {
		project_ids,
	};

	const response = await planeRequest.call(this, {
		method: 'POST',
		url: API_ENDPOINTS.INITIATIVE_PROJECTS(slug, initiativeId),
		body,
	});

	return this.helpers.returnJsonArray(Array.isArray(response) ? response : [response]);
}
