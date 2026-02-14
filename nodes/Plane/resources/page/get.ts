import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeProperties,
} from 'n8n-workflow';

import { API_ENDPOINTS } from '../../utils/constants';
import { planeRequest, getWorkspaceSlug } from '../../utils/helpers';

const showFor = {
	operation: ['get'],
	resource: ['page'],
};

export const pageGetDescription: INodeProperties[] = [
	{
		displayName: 'Scope',
		name: 'scope',
		type: 'options',
		default: 'workspace',
		required: true,
		options: [
			{ name: 'Workspace', value: 'workspace' },
			{ name: 'Project', value: 'project' },
		],
		description: 'Whether to get a workspace-level or project-level page',
		displayOptions: {
			show: showFor,
		},
	},
	{
		displayName: 'Project ID',
		name: 'projectId',
		type: 'string',
		default: '',
		required: true,
		description: 'The ID of the project',
		displayOptions: {
			show: {
				...showFor,
				scope: ['project'],
			},
		},
	},
	{
		displayName: 'Page ID',
		name: 'pageId',
		type: 'string',
		default: '',
		required: true,
		description: 'The ID of the page to retrieve',
		displayOptions: {
			show: showFor,
		},
	},
];

export async function pageGet(
	this: IExecuteFunctions,
): Promise<INodeExecutionData[]> {
	const slug = await getWorkspaceSlug(this);
	const scope = this.getNodeParameter('scope', 0) as string;
	const pageId = this.getNodeParameter('pageId', 0) as string;

	let url: string;
	if (scope === 'project') {
		const projectId = this.getNodeParameter('projectId', 0) as string;
		url = API_ENDPOINTS.PROJECT_PAGE(slug, projectId, pageId);
	} else {
		url = API_ENDPOINTS.WORKSPACE_PAGE(slug, pageId);
	}

	const response = await planeRequest.call(this, {
		method: 'GET',
		url,
	});

	return this.helpers.returnJsonArray(Array.isArray(response) ? response : [response]);
}
