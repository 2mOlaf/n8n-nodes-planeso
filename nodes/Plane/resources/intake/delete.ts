import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeProperties,
} from 'n8n-workflow';

import { API_ENDPOINTS } from '../../utils/constants';
import { planeRequest, getWorkspaceSlug } from '../../utils/helpers';

const showFor = {
	operation: ['delete'],
	resource: ['intake'],
};

export const intakeDeleteDescription: INodeProperties[] = [
	{
		displayName: 'Intake ID',
		name: 'intakeId',
		type: 'string',
		default: '',
		required: true,
		description: 'The ID of the intake issue to delete',
		displayOptions: {
			show: showFor,
		},
	},
];

export async function intakeDelete(
	this: IExecuteFunctions,
): Promise<INodeExecutionData[]> {
	const slug = await getWorkspaceSlug(this);
	const intakeId = this.getNodeParameter('intakeId', 0) as string;

	await planeRequest.call(this, {
		method: 'DELETE',
		url: API_ENDPOINTS.INTAKE_ISSUE(slug, intakeId),
	});

	return this.helpers.returnJsonArray([{ success: true }]);
}
