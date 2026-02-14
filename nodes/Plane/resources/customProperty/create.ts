import type {
	IDataObject,
	IExecuteFunctions,
	INodeExecutionData,
	INodeProperties,
} from 'n8n-workflow';

import { API_ENDPOINTS } from '../../utils/constants';
import { getWorkspaceSlug, planeRequest, rlcValue } from '../../utils/helpers';
import { projectRlc, workItemTypeRlc } from '../../utils/rlcDefs';

const showFor = {
	operation: ['create'],
	resource: ['customProperty'],
};

export const customPropertyCreateDescription: INodeProperties[] = [
	projectRlc(showFor),
	workItemTypeRlc(showFor),
	{
		displayName: 'Display Name',
		name: 'display_name',
		type: 'string',
		default: '',
		required: true,
		description: 'The display name of the custom property',
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
				description: 'The description of the custom property',
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

export async function customPropertyCreate(
	this: IExecuteFunctions,
): Promise<INodeExecutionData[]> {
	const slug = await getWorkspaceSlug(this);
	const projectId = rlcValue(this, 'projectId', 0);
	const typeId = rlcValue(this, 'typeId', 0);
	const display_name = this.getNodeParameter('display_name', 0) as string;
	const additionalFields = this.getNodeParameter('additionalFields', 0) as IDataObject;

	const body: IDataObject = {
		display_name,
		...additionalFields,
	};

	const response = await planeRequest.call(this, {
		method: 'POST',
		url: API_ENDPOINTS.CUSTOM_PROPERTIES(slug, projectId, typeId),
		body,
	});

	const results = Array.isArray(response) ? response : [response];
	return this.helpers.returnJsonArray(results);
}
