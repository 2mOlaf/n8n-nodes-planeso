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
	resource: ['sticky'],
};

export const stickyCreateDescription: INodeProperties[] = [
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

export async function stickyCreate(
	this: IExecuteFunctions,
): Promise<INodeExecutionData[]> {
	const slug = await getWorkspaceSlug(this);
	const additionalFields = this.getNodeParameter('additionalFields', 0) as IDataObject;

	const body: IDataObject = {
		...additionalFields,
	};

	const response = await planeRequest.call(this, {
		method: 'POST',
		url: API_ENDPOINTS.STICKIES(slug),
		body,
	});

	const results = Array.isArray(response) ? response : [response];
	return this.helpers.returnJsonArray(results);
}
