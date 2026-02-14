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
	resource: ['intake'],
};

export const intakeUpdateDescription: INodeProperties[] = [
	{
		displayName: 'Intake ID',
		name: 'intakeId',
		type: 'string',
		default: '',
		required: true,
		description: 'The ID of the intake issue to update',
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
				displayName: 'Description HTML',
				name: 'description_html',
				type: 'string',
				default: '',
				description: 'The description of the intake issue in HTML format',
			},
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				default: '',
				description: 'The name of the intake issue',
			},
			{
				displayName: 'Priority',
				name: 'priority',
				type: 'options',
				default: 'none',
				options: [
					{ name: 'High', value: 'high' },
					{ name: 'Low', value: 'low' },
					{ name: 'Medium', value: 'medium' },
					{ name: 'None', value: 'none' },
					{ name: 'Urgent', value: 'urgent' },
				],
				description: 'The priority of the intake issue',
			},
			{
				displayName: 'Project',
				name: 'project',
				type: 'string',
				default: '',
				description: 'The project ID for the intake issue',
			},
			{
				displayName: 'State',
				name: 'state',
				type: 'string',
				default: '',
				description: 'The state ID for the intake issue',
			},
		],
	},
];

export async function intakeUpdate(
	this: IExecuteFunctions,
): Promise<INodeExecutionData[]> {
	const slug = await getWorkspaceSlug(this);
	const intakeId = this.getNodeParameter('intakeId', 0) as string;
	const updateFields = this.getNodeParameter('updateFields', 0) as IDataObject;

	const body: IDataObject = {
		...updateFields,
	};

	const response = await planeRequest.call(this, {
		method: 'PATCH',
		url: API_ENDPOINTS.INTAKE_ISSUE(slug, intakeId),
		body,
	});

	return this.helpers.returnJsonArray(Array.isArray(response) ? response : [response]);
}
