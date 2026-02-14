import type {
	IDataObject,
	IExecuteFunctions,
	INodeExecutionData,
	INodeProperties,
} from 'n8n-workflow';

import { API_ENDPOINTS } from '../../utils/constants';
import { getWorkspaceSlug, planeRequestOffsetAllItems } from '../../utils/helpers';

const showFor = {
	operation: ['search'],
	resource: ['workItem'],
};

export const workItemSearchDescription: INodeProperties[] = [
	{
		displayName: 'Search Query',
		name: 'search',
		type: 'string',
		default: '',
		required: true,
		description: 'The search query to find work items',
		displayOptions: {
			show: showFor,
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

export async function workItemSearch(
	this: IExecuteFunctions,
): Promise<INodeExecutionData[]> {
	const slug = await getWorkspaceSlug(this);
	const search = this.getNodeParameter('search', 0) as string;
	const returnAll = this.getNodeParameter('returnAll', 0) as boolean;
	const limit = this.getNodeParameter('limit', 0, 50) as number;

	const results = await planeRequestOffsetAllItems.call(
		this,
		{
			method: 'GET',
			url: API_ENDPOINTS.WORK_ITEMS_SEARCH(slug),
			qs: { search } as IDataObject,
		},
		returnAll,
		limit,
	);

	return this.helpers.returnJsonArray(results as IDataObject[]);
}
