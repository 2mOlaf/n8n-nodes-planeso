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
	resource: ['workItemType'],
};

export const workItemTypeUpdateDescription: INodeProperties[] = [
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
		displayName: 'Type ID',
		name: 'typeId',
		type: 'string',
		default: '',
		required: true,
		description: 'The ID of the work item type to update',
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

export async function workItemTypeUpdate(
	this: IExecuteFunctions,
): Promise<INodeExecutionData[]> {
	const slug = await getWorkspaceSlug(this);
	const projectId = this.getNodeParameter('projectId', 0) as string;
	const typeId = this.getNodeParameter('typeId', 0) as string;
	const updateFields = this.getNodeParameter('updateFields', 0) as IDataObject;

	const body: IDataObject = {};

	if (updateFields.name) {
		body.name = updateFields.name;
	}
	if (updateFields.description) {
		body.description = updateFields.description;
	}
	if (updateFields.is_epic !== undefined) {
		body.is_epic = updateFields.is_epic;
	}
	if (updateFields.is_default !== undefined) {
		body.is_default = updateFields.is_default;
	}
	if (updateFields.is_active !== undefined) {
		body.is_active = updateFields.is_active;
	}
	if (updateFields.level !== undefined) {
		body.level = updateFields.level;
	}

	const response = await planeRequest.call(this, {
		method: 'PATCH',
		url: API_ENDPOINTS.WORK_ITEM_TYPE(slug, projectId, typeId),
		body,
	});

	return this.helpers.returnJsonArray(Array.isArray(response) ? response : [response]);
}
