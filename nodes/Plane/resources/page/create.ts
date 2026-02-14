import type {
	IDataObject,
	IExecuteFunctions,
	INodeExecutionData,
	INodeProperties,
} from 'n8n-workflow';

import { API_ENDPOINTS } from '../../utils/constants';
import { planeRequest, getWorkspaceSlug } from '../../utils/helpers';

const showFor = {
	operation: ['create'],
	resource: ['page'],
};

export const pageCreateDescription: INodeProperties[] = [
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
		description: 'Whether to create a workspace-level or project-level page',
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
		displayName: 'Name',
		name: 'name',
		type: 'string',
		default: '',
		required: true,
		description: 'The name of the page',
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
				displayName: 'Description HTML',
				name: 'description_html',
				type: 'string',
				default: '',
				description: 'The description of the page in HTML format',
			},
		],
	},
];

export async function pageCreate(
	this: IExecuteFunctions,
): Promise<INodeExecutionData[]> {
	const slug = await getWorkspaceSlug(this);
	const scope = this.getNodeParameter('scope', 0) as string;
	const name = this.getNodeParameter('name', 0) as string;
	const additionalFields = this.getNodeParameter('additionalFields', 0) as IDataObject;

	const body: IDataObject = {
		name,
		...additionalFields,
	};

	let url: string;
	if (scope === 'project') {
		const projectId = this.getNodeParameter('projectId', 0) as string;
		url = API_ENDPOINTS.PROJECT_PAGES(slug, projectId);
	} else {
		url = API_ENDPOINTS.WORKSPACE_PAGES(slug);
	}

	const response = await planeRequest.call(this, {
		method: 'POST',
		url,
		body,
	});

	return this.helpers.returnJsonArray(Array.isArray(response) ? response : [response]);
}
