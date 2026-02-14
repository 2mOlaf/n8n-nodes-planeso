import type {
	IDataObject,
	IExecuteFunctions,
	INodeExecutionData,
	INodeProperties,
} from 'n8n-workflow';

import { API_ENDPOINTS } from '../../utils/constants';
import { planeRequest, getWorkspaceSlug } from '../../utils/helpers';

const showFor = {
	operation: ['update'],
	resource: ['workItemLink'],
};

export const workItemLinkUpdateDescription: INodeProperties[] = [
	{
		displayName: 'Project ID',
		name: 'projectId',
		type: 'string',
		default: '',
		required: true,
		description: 'The ID of the project',
		displayOptions: {
			show: showFor,
		},
	},
	{
		displayName: 'Work Item ID',
		name: 'workItemId',
		type: 'string',
		default: '',
		required: true,
		description: 'The ID of the work item',
		displayOptions: {
			show: showFor,
		},
	},
	{
		displayName: 'Link ID',
		name: 'linkId',
		type: 'string',
		default: '',
		required: true,
		description: 'The ID of the link to update',
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
				displayName: 'URL',
				name: 'url',
				type: 'string',
				default: '',
				description: 'The URL of the link',
			},
			{
				displayName: 'Title',
				name: 'title',
				type: 'string',
				default: '',
				description: 'The title of the link',
			},
		],
	},
];

export async function workItemLinkUpdate(
	this: IExecuteFunctions,
): Promise<INodeExecutionData[]> {
	const slug = await getWorkspaceSlug(this);
	const projectId = this.getNodeParameter('projectId', 0) as string;
	const workItemId = this.getNodeParameter('workItemId', 0) as string;
	const linkId = this.getNodeParameter('linkId', 0) as string;
	const updateFields = this.getNodeParameter('updateFields', 0) as IDataObject;

	const body: IDataObject = {};

	if (updateFields.url) {
		body.url = updateFields.url;
	}
	if (updateFields.title) {
		body.title = updateFields.title;
	}

	const response = await planeRequest.call(this, {
		method: 'PATCH',
		url: API_ENDPOINTS.WORK_ITEM_LINK(slug, projectId, workItemId, linkId),
		body,
	});

	return this.helpers.returnJsonArray(Array.isArray(response) ? response : [response]);
}
