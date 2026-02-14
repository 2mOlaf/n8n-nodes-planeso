import type {
	IDataObject,
	IExecuteFunctions,
	INodeExecutionData,
	INodeProperties,
} from 'n8n-workflow';

import { API_ENDPOINTS } from '../../utils/constants';
import { getWorkspaceSlug, planeRequest, rlcValue } from '../../utils/helpers';
import { projectRlc } from '../../utils/rlcDefs';

const showFor = {
	operation: ['update'],
	resource: ['project'],
};

export const projectUpdateDescription: INodeProperties[] = [
	projectRlc(showFor),
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: showFor,
		},
		options: [
			{
				displayName: 'Description',
				name: 'description',
				type: 'string',
				default: '',
				description: 'The description of the project',
			},
			{
				displayName: 'Identifier',
				name: 'identifier',
				type: 'string',
				default: '',
				description: 'A unique identifier for the project (1-12 uppercase characters)',
			},
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				default: '',
				description: 'The name of the project',
			},
			{
				displayName: 'Network',
				name: 'network',
				type: 'options',
				default: 2,
				options: [
					{
						name: 'Secret',
						value: 0,
					},
					{
						name: 'Public',
						value: 2,
					},
				],
				description: 'The network visibility of the project',
			},
		],
	},
];

export async function projectUpdate(
	this: IExecuteFunctions,
): Promise<INodeExecutionData[]> {
	const slug = await getWorkspaceSlug(this);
	const projectId = rlcValue(this, 'projectId', 0);
	const updateFields = this.getNodeParameter('updateFields', 0) as IDataObject;

	const body: IDataObject = {
		...updateFields,
	};

	const response = await planeRequest.call(this, {
		method: 'PATCH',
		url: API_ENDPOINTS.PROJECT(slug, projectId),
		body,
	});

	const results = Array.isArray(response) ? response : [response];
	return this.helpers.returnJsonArray(results);
}
