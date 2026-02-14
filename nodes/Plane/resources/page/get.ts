import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeProperties,
} from 'n8n-workflow';

import { API_ENDPOINTS } from '../../utils/constants';
import { planeRequest, getWorkspaceSlug, rlcValue } from '../../utils/helpers';
import { pageRlc } from '../../utils/rlcDefs';

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
		displayName: 'Project',
		name: 'projectId',
		type: 'resourceLocator',
		default: { mode: 'list', value: '' },
		required: true,
		description: 'The project to use',
		modes: [
			{
				displayName: 'From List',
				name: 'list',
				type: 'list',
				placeholder: 'Select a project...',
				typeOptions: {
					searchListMethod: 'searchProjects',
					searchable: true,
				},
			},
			{
				displayName: 'By ID',
				name: 'id',
				type: 'string',
				placeholder: 'e.g. 00000000-0000-0000-0000-000000000000',
				validation: [
					{
						type: 'regex',
						properties: {
							regex: '[a-fA-F0-9-]+',
							errorMessage: 'Not a valid ID',
						},
					},
				],
			},
		],
		displayOptions: {
			show: {
				...showFor,
				scope: ['project'],
			},
		},
	},
	pageRlc(showFor),
];

export async function pageGet(
	this: IExecuteFunctions,
): Promise<INodeExecutionData[]> {
	const slug = await getWorkspaceSlug(this);
	const scope = this.getNodeParameter('scope', 0) as string;
	const pageId = rlcValue(this, 'pageId', 0);

	let url: string;
	if (scope === 'project') {
		const projectId = rlcValue(this, 'projectId', 0);
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
