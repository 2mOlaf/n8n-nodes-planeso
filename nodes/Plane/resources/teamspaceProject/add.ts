import type {
	IDataObject,
	IExecuteFunctions,
	INodeExecutionData,
	INodeProperties,
} from 'n8n-workflow';

import { API_ENDPOINTS } from '../../utils/constants';
import { getWorkspaceSlug, planeRequest, rlcValue } from '../../utils/helpers';
import { teamspaceRlc } from '../../utils/rlcDefs';

const showFor = {
	operation: ['add'],
	resource: ['teamspaceProject'],
};

export const teamspaceProjectAddDescription: INodeProperties[] = [
	teamspaceRlc(showFor),
	{
		displayName: 'Project Names or IDs',
		name: 'project_ids',
		type: 'multiOptions',
		default: [],
		required: true,
		description: 'The projects to select. Choose from the list, or specify IDs using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
		typeOptions: {
			loadOptionsMethod: 'getProjects',
		},
		displayOptions: {
			show: showFor,
		},
	},
];

export async function teamspaceProjectAdd(
	this: IExecuteFunctions,
): Promise<INodeExecutionData[]> {
	const slug = await getWorkspaceSlug(this);
	const teamspaceId = rlcValue(this, 'teamspaceId', 0);
	const projectIdsRaw = this.getNodeParameter('project_ids', 0);
	const project_ids = Array.isArray(projectIdsRaw) ? projectIdsRaw : (projectIdsRaw as string).split(',').map((id) => id.trim());

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
