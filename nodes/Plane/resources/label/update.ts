import type {
	IDataObject,
	IExecuteFunctions,
	INodeExecutionData,
	INodeProperties,
} from 'n8n-workflow';

import { API_ENDPOINTS } from '../../utils/constants';
import { getWorkspaceSlug, planeRequest } from '../../utils/helpers';

const showFor = {
	operation: ['update'],
	resource: ['label'],
};

export const labelUpdateDescription: INodeProperties[] = [
	{
		displayName: 'Project ID',
		name: 'projectId',
		type: 'string',
		default: '',
		required: true,
		description: 'The ID of the project the label belongs to',
		displayOptions: {
			show: showFor,
		},
	},
	{
		displayName: 'Label ID',
		name: 'labelId',
		type: 'string',
		default: '',
		required: true,
		description: 'The ID of the label to update',
		displayOptions: {
			show: showFor,
		},
	},
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
				displayName: 'Color',
				name: 'color',
				type: 'color',
				default: '',
				description: 'The color of the label in hex format (e.g. #ff0000)',
			},
			{
				displayName: 'Description',
				name: 'description',
				type: 'string',
				default: '',
				description: 'The description of the label',
			},
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				default: '',
				description: 'The name of the label',
			},
		],
	},
];

export async function labelUpdate(
	this: IExecuteFunctions,
): Promise<INodeExecutionData[]> {
	const slug = await getWorkspaceSlug(this);
	const projectId = this.getNodeParameter('projectId', 0) as string;
	const labelId = this.getNodeParameter('labelId', 0) as string;
	const updateFields = this.getNodeParameter('updateFields', 0) as IDataObject;

	const body: IDataObject = {
		...updateFields,
	};

	const response = await planeRequest.call(this, {
		method: 'PATCH',
		url: API_ENDPOINTS.LABEL(slug, projectId, labelId),
		body,
	});

	const results = Array.isArray(response) ? response : [response];
	return this.helpers.returnJsonArray(results);
}
