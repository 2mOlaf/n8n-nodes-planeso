import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeProperties,
} from 'n8n-workflow';

import { API_ENDPOINTS } from '../../utils/constants';
import { planeRequest, getWorkspaceSlug } from '../../utils/helpers';

const showFor = {
	operation: ['getByIdentifier'],
	resource: ['workItem'],
};

export const workItemGetByIdentifierDescription: INodeProperties[] = [
	{
		displayName: 'Identifier',
		name: 'identifier',
		type: 'string',
		default: '',
		required: true,
		description: 'Work item identifier e.g. PROJECT-123',
		displayOptions: {
			show: showFor,
		},
	},
];

export async function workItemGetByIdentifier(
	this: IExecuteFunctions,
): Promise<INodeExecutionData[]> {
	const slug = await getWorkspaceSlug(this);
	const identifier = this.getNodeParameter('identifier', 0) as string;

	const response = await planeRequest.call(this, {
		method: 'GET',
		url: API_ENDPOINTS.WORK_ITEM_BY_IDENTIFIER(slug, identifier),
	});

	return this.helpers.returnJsonArray(Array.isArray(response) ? response : [response]);
}
