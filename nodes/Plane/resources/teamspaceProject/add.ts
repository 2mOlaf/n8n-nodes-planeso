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
	resource: ['teamspaceProject'],
};

export const teamspaceProjectAddDescription: INodeProperties[] = [
	{
		displayName: 'Teamspace ID',
		name: 'teamspaceId',
		type: 'string',
		default: '',
		required: true,
		description: 'The ID of the teamspace to add projects to',
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
		description: 'Comma-separated UUIDs of the projects to add',
		displayOptions: {
			show: showFor,
		},
	},
];

export async function teamspaceProjectAdd(
	this: IExecuteFunctions,
): Promise<INodeExecutionData[]> {
	const slug = await getWorkspaceSlug(this);
	const teamspaceId = this.getNodeParameter('teamspaceId', 0) as string;
	const projectIdsRaw = this.getNodeParameter('project_ids', 0) as string;
	const project_ids = projectIdsRaw.split(',').map((id) => id.trim());

	const body: IDataObject = {
		project_ids,
	};

	const response = await planeRequest.call(this, {
		method: 'POST',
		url: API_ENDPOINTS.TEAMSPACE_PROJECTS(slug, teamspaceId),
		body,
	});

	const results = Array.isArray(response) ? response : [response];
	return this.helpers.returnJsonArray(results);
}
