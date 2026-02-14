import type {
	IDataObject,
	IExecuteFunctions,
	INodeExecutionData,
	INodeProperties,
} from 'n8n-workflow';

import { API_ENDPOINTS } from '../../utils/constants';
import { getWorkspaceSlug, planeRequestCursorAllItems } from '../../utils/helpers';

const showFor = {
	operation: ['getAll'],
	resource: ['project'],
};

export const projectGetAllDescription: INodeProperties[] = [
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

export async function projectGetAll(
	this: IExecuteFunctions,
): Promise<INodeExecutionData[]> {
	const slug = await getWorkspaceSlug(this);
	const returnAll = this.getNodeParameter('returnAll', 0) as boolean;
	const limit = this.getNodeParameter('limit', 0, 50) as number;

	const results = await planeRequestCursorAllItems.call(
		this,
		{
			method: 'GET',
			url: API_ENDPOINTS.PROJECTS(slug),
		},
		returnAll,
		limit,
	);

	return this.helpers.returnJsonArray(results as IDataObject[]);
}
