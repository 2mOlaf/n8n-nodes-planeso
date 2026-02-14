import type {
	IDataObject,
	IExecuteFunctions,
	INodeExecutionData,
	INodeProperties,
} from 'n8n-workflow';

import { API_ENDPOINTS } from '../../utils/constants';
import { getWorkspaceSlug, planeRequest, rlcValue } from '../../utils/helpers';
import { projectRlc, propertyRlc, optionRlc } from '../../utils/rlcDefs';

const showFor = {
	operation: ['update'],
	resource: ['customPropertyOption'],
};

export const customPropertyOptionUpdateDescription: INodeProperties[] = [
	projectRlc(showFor),
	propertyRlc(showFor),
	optionRlc(showFor),
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
				description: 'The description of the option',
			},
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				default: '',
				description: 'The name of the option',
			},
		],
	},
];

export async function customPropertyOptionUpdate(
	this: IExecuteFunctions,
): Promise<INodeExecutionData[]> {
	const slug = await getWorkspaceSlug(this);
	const projectId = rlcValue(this, 'projectId', 0);
	const propertyId = rlcValue(this, 'propertyId', 0);
	const optionId = rlcValue(this, 'optionId', 0);
	const updateFields = this.getNodeParameter('updateFields', 0) as IDataObject;

	const body: IDataObject = {
		...updateFields,
	};

	const response = await planeRequest.call(this, {
		method: 'PATCH',
		url: API_ENDPOINTS.CUSTOM_PROPERTY_OPTION(slug, projectId, propertyId, optionId),
		body,
	});

	const results = Array.isArray(response) ? response : [response];
	return this.helpers.returnJsonArray(results);
}
