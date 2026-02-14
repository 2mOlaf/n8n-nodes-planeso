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
	operation: ['add'],
	resource: ['initiativeProject'],
};

export const initiativeProjectAddDescription: INodeProperties[] = [
	initiativeRlc(showFor),
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

export async function initiativeProjectAdd(
	this: IExecuteFunctions,
): Promise<INodeExecutionData[]> {
	const slug = await getWorkspaceSlug(this);
	const initiativeId = rlcValue(this, 'initiativeId', 0);
	const projectIdsRaw = this.getNodeParameter('project_ids', 0);
	const project_ids = Array.isArray(projectIdsRaw) ? projectIdsRaw : (projectIdsRaw as string).split(',').map((id) => id.trim());

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
