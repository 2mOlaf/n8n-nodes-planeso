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
	resource: ['sticky'],
};

export const stickyUpdateDescription: INodeProperties[] = [
	{
		displayName: 'Sticky ID',
		name: 'stickyId',
		type: 'string',
		default: '',
		required: true,
		description: 'The ID of the sticky to update',
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
				displayName: 'Background Color',
				name: 'background_color',
				type: 'color',
				default: '',
				description: 'The background color of the sticky',
			},
			{
				displayName: 'Color',
				name: 'color',
				type: 'color',
				default: '',
				description: 'The color of the sticky',
			},
			{
				displayName: 'Description HTML',
				name: 'description_html',
				type: 'string',
				default: '',
				description: 'The HTML description of the sticky',
			},
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				default: '',
				description: 'The name of the sticky',
			},
		],
	},
];

export async function stickyUpdate(
	this: IExecuteFunctions,
): Promise<INodeExecutionData[]> {
	const slug = await getWorkspaceSlug(this);
	const stickyId = this.getNodeParameter('stickyId', 0) as string;
	const updateFields = this.getNodeParameter('updateFields', 0) as IDataObject;

	const body: IDataObject = {
		...updateFields,
	};

	const response = await planeRequest.call(this, {
		method: 'PATCH',
		url: API_ENDPOINTS.STICKY(slug, stickyId),
		body,
	});

	const results = Array.isArray(response) ? response : [response];
	return this.helpers.returnJsonArray(results);
}
