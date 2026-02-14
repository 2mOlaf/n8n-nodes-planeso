import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeProperties,
} from 'n8n-workflow';

import { API_ENDPOINTS } from '../../utils/constants';
import { planeRequest, getWorkspaceSlug } from '../../utils/helpers';

const showFor = {
	operation: ['get'],
	resource: ['intake'],
};

export const intakeGetDescription: INodeProperties[] = [
	{
		displayName: 'Intake ID',
		name: 'intakeId',
		type: 'string',
		default: '',
		required: true,
		description: 'The ID of the intake issue to retrieve',
		displayOptions: {
			show: showFor,
		},
	},
];

export async function intakeGet(
	this: IExecuteFunctions,
): Promise<INodeExecutionData[]> {
	const slug = await getWorkspaceSlug(this);
	const intakeId = this.getNodeParameter('intakeId', 0) as string;

	const response = await planeRequest.call(this, {
		method: 'GET',
		url: API_ENDPOINTS.INTAKE_ISSUE(slug, intakeId),
	});

	return this.helpers.returnJsonArray(Array.isArray(response) ? response : [response]);
}
