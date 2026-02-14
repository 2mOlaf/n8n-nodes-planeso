import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeProperties,
} from 'n8n-workflow';

import { API_ENDPOINTS } from '../../utils/constants';
import { planeRequest, getWorkspaceSlug } from '../../utils/helpers';

const showFor = {
	operation: ['delete'],
	resource: ['workItemAttachment'],
};

export const workItemAttachmentDeleteDescription: INodeProperties[] = [
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
		displayName: 'Attachment ID',
		name: 'attachmentId',
		type: 'string',
		default: '',
		required: true,
		description: 'The ID of the attachment to delete',
		displayOptions: {
			show: showFor,
		},
	},
];

export async function workItemAttachmentDelete(
	this: IExecuteFunctions,
): Promise<INodeExecutionData[]> {
	const slug = await getWorkspaceSlug(this);
	const projectId = this.getNodeParameter('projectId', 0) as string;
	const workItemId = this.getNodeParameter('workItemId', 0) as string;
	const attachmentId = this.getNodeParameter('attachmentId', 0) as string;

	const response = await planeRequest.call(this, {
		method: 'DELETE',
		url: API_ENDPOINTS.WORK_ITEM_ATTACHMENT(slug, projectId, workItemId, attachmentId),
	});

	return this.helpers.returnJsonArray(Array.isArray(response) ? response : [response]);
}
