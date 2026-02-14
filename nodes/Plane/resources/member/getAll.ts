import type {
	IDataObject,
	IExecuteFunctions,
	INodeExecutionData,
	INodeProperties,
} from 'n8n-workflow';

import { API_ENDPOINTS } from '../../utils/constants';
import { getWorkspaceSlug, planeRequestOffsetAllItems } from '../../utils/helpers';

const showFor = {
	operation: ['getAll'],
	resource: ['member'],
};

export const memberGetAllDescription: INodeProperties[] = [
	{
		displayName: 'Scope',
		name: 'scope',
		type: 'options',
		default: 'workspace',
		required: true,
		options: [
			{
				name: 'Workspace',
				value: 'workspace',
			},
			{
				name: 'Project',
				value: 'project',
			},
		],
		description: 'Whether to list workspace members or project members',
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
		description: 'The ID of the project to list members for',
		displayOptions: {
			show: {
				...showFor,
				scope: ['project'],
			},
		},
	},
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		default: false,
		description: 'Whether to return all results or only up to a given limit',
		displayOptions: {
			show: showFor,
		},
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		default: 50,
		description: 'Max number of results to return',
		typeOptions: {
			minValue: 1,
		},
		displayOptions: {
			show: {
				...showFor,
				returnAll: [false],
			},
		},
	},
];

export async function memberGetAll(
	this: IExecuteFunctions,
): Promise<INodeExecutionData[]> {
	const slug = await getWorkspaceSlug(this);
	const scope = this.getNodeParameter('scope', 0) as string;
	const returnAll = this.getNodeParameter('returnAll', 0) as boolean;
	const limit = this.getNodeParameter('limit', 0, 50) as number;

	let url: string;
	if (scope === 'project') {
		const projectId = this.getNodeParameter('projectId', 0) as string;
		url = API_ENDPOINTS.PROJECT_MEMBERS(slug, projectId);
	} else {
		url = API_ENDPOINTS.WORKSPACE_MEMBERS(slug);
	}

	const results = await planeRequestOffsetAllItems.call(
		this,
		{
			method: 'GET',
			url,
		},
		returnAll,
		limit,
	);

	return this.helpers.returnJsonArray(results as IDataObject[]);
}
