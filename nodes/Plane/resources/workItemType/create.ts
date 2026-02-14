import type {
	IDataObject,
	IExecuteFunctions,
	INodeExecutionData,
	INodeProperties,
} from 'n8n-workflow';

import { API_ENDPOINTS } from '../../utils/constants';
import { planeRequest, getWorkspaceSlug } from '../../utils/helpers';

const showFor = {
	operation: ['create'],
	resource: ['workItemType'],
};

export const workItemTypeCreateDescription: INodeProperties[] = [
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
				description: 'The description of the work item type',
			},
			{
				displayName: 'Is Active',
				name: 'is_active',
				type: 'boolean',
				default: true,
				description: 'Whether this work item type is active',
			},
			{
				displayName: 'Is Default',
				name: 'is_default',
				type: 'boolean',
				default: false,
				description: 'Whether this is the default work item type',
			},
			{
				displayName: 'Is Epic',
				name: 'is_epic',
				type: 'boolean',
				default: false,
				description: 'Whether this type represents an epic',
			},
			{
				displayName: 'Level',
				name: 'level',
				type: 'number',
				default: 0,
				description: 'The level of the work item type',
			},
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				default: '',
				description: 'The name of the work item type',
			},
		],
	},
];

export async function workItemTypeCreate(
	this: IExecuteFunctions,
): Promise<INodeExecutionData[]> {
	const slug = await getWorkspaceSlug(this);
	const projectId = this.getNodeParameter('projectId', 0) as string;
	const additionalFields = this.getNodeParameter('additionalFields', 0) as IDataObject;

	const body: IDataObject = {};

	if (additionalFields.name) {
		body.name = additionalFields.name;
	}
	if (additionalFields.description) {
		body.description = additionalFields.description;
	}
	if (additionalFields.is_epic !== undefined) {
		body.is_epic = additionalFields.is_epic;
	}
	if (additionalFields.is_default !== undefined) {
		body.is_default = additionalFields.is_default;
	}
	if (additionalFields.is_active !== undefined) {
		body.is_active = additionalFields.is_active;
	}
	if (additionalFields.level !== undefined) {
		body.level = additionalFields.level;
	}

	const response = await planeRequest.call(this, {
		method: 'POST',
		url: API_ENDPOINTS.WORK_ITEM_TYPES(slug, projectId),
		body,
	});

	return this.helpers.returnJsonArray(Array.isArray(response) ? response : [response]);
}
