import type {
	IDataObject,
	IExecuteFunctions,
	INodeExecutionData,
	INodeProperties,
} from 'n8n-workflow';

import { API_ENDPOINTS } from '../../utils/constants';
import { planeRequest, getWorkspaceSlug, rlcValue } from '../../utils/helpers';
import { projectRlc, cycleRlc } from '../../utils/rlcDefs';

const showFor = {
	operation: ['update'],
	resource: ['cycle'],
};

export const cycleUpdateDescription: INodeProperties[] = [
	projectRlc(showFor),
	cycleRlc(showFor),
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
				description: 'The description of the cycle',
			},
			{
				displayName: 'End Date',
				name: 'end_date',
				type: 'string',
				default: '',
				placeholder: 'YYYY-MM-DD',
				description: 'The end date of the cycle',
			},
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				default: '',
				description: 'The name of the cycle',
			},
			{
				displayName: 'Owned By Name or ID',
				name: 'owned_by',
				type: 'options',
				default: '',
				description: 'The user who owns the cycle. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
				typeOptions: {
					loadOptionsMethod: 'getMembers',
				},
			},
			{
				displayName: 'Start Date',
				name: 'start_date',
				type: 'string',
				default: '',
				placeholder: 'YYYY-MM-DD',
				description: 'The start date of the cycle',
			},
		],
	},
];

export async function cycleUpdate(
	this: IExecuteFunctions,
): Promise<INodeExecutionData[]> {
	const slug = await getWorkspaceSlug(this);
	const projectId = rlcValue(this, 'projectId', 0);
	const cycleId = rlcValue(this, 'cycleId', 0);
	const updateFields = this.getNodeParameter('updateFields', 0) as IDataObject;

	const body: IDataObject = {
		...updateFields,
	};

	const response = await planeRequest.call(this, {
		method: 'PATCH',
		url: API_ENDPOINTS.CYCLE(slug, projectId, cycleId),
		body,
	});

	return this.helpers.returnJsonArray(Array.isArray(response) ? response : [response]);
}
