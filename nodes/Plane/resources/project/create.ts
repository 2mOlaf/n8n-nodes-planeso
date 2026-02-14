import type {
	IDataObject,
	IExecuteFunctions,
	INodeExecutionData,
	INodeProperties,
} from 'n8n-workflow';

import { API_ENDPOINTS } from '../../utils/constants';
import { getWorkspaceSlug, planeRequest } from '../../utils/helpers';

const showFor = {
	operation: ['create'],
	resource: ['project'],
};

export const projectCreateDescription: INodeProperties[] = [
	{
		displayName: 'Name',
		name: 'name',
		type: 'string',
		default: '',
		required: true,
		description: 'The name of the project',
		displayOptions: {
			show: showFor,
		},
	},
	{
		displayName: 'Identifier',
		name: 'identifier',
		type: 'string',
		default: '',
		required: true,
		description: 'A unique identifier for the project (1-12 uppercase characters)',
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
				displayName: 'Description',
				name: 'description',
				type: 'string',
				default: '',
				description: 'The description of the project',
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

export async function projectCreate(
	this: IExecuteFunctions,
): Promise<INodeExecutionData[]> {
	const slug = await getWorkspaceSlug(this);
	const name = this.getNodeParameter('name', 0) as string;
	const identifier = this.getNodeParameter('identifier', 0) as string;
	const additionalFields = this.getNodeParameter('additionalFields', 0) as IDataObject;

	const body: IDataObject = {
		name,
		identifier,
		...additionalFields,
	};

	const response = await planeRequest.call(this, {
		method: 'POST',
		url: API_ENDPOINTS.PROJECTS(slug),
		body,
	});

	const results = Array.isArray(response) ? response : [response];
	return this.helpers.returnJsonArray(results);
}
