import type {
	IDataObject,
	IExecuteFunctions,
	INodeExecutionData,
	INodeProperties,
} from 'n8n-workflow';

import { API_ENDPOINTS } from '../../utils/constants';
import { getWorkspaceSlug, planeRequest, rlcValue } from '../../utils/helpers';
import { projectRlc, workItemTypeRlc, propertyRlc } from '../../utils/rlcDefs';

const showFor = {
	operation: ['update'],
	resource: ['customProperty'],
};

export const customPropertyUpdateDescription: INodeProperties[] = [
	projectRlc(showFor),
	workItemTypeRlc(showFor),
	propertyRlc(showFor),
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
				description: 'The description of the custom property',
			},
			{
				displayName: 'Display Name',
				name: 'display_name',
				type: 'string',
				default: '',
				description: 'The display name of the custom property',
			},
			{
				displayName: 'Is Active',
				name: 'is_active',
				type: 'boolean',
				default: true,
				description: 'Whether the custom property is active',
			},
			{
				displayName: 'Is Multi',
				name: 'is_multi',
				type: 'boolean',
				default: false,
				description: 'Whether the custom property allows multiple values',
			},
			{
				displayName: 'Is Required',
				name: 'is_required',
				type: 'boolean',
				default: false,
				description: 'Whether the custom property is required',
			},
		],
	},
];

export async function customPropertyUpdate(
	this: IExecuteFunctions,
): Promise<INodeExecutionData[]> {
	const slug = await getWorkspaceSlug(this);
	const projectId = rlcValue(this, 'projectId', 0);
	const typeId = rlcValue(this, 'typeId', 0);
	const propertyId = rlcValue(this, 'propertyId', 0);
	const updateFields = this.getNodeParameter('updateFields', 0) as IDataObject;

	const body: IDataObject = {
		...updateFields,
	};

	const response = await planeRequest.call(this, {
		method: 'PATCH',
		url: API_ENDPOINTS.CUSTOM_PROPERTY(slug, projectId, typeId, propertyId),
		body,
	});

	const results = Array.isArray(response) ? response : [response];
	return this.helpers.returnJsonArray(results);
}
