import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeProperties,
} from 'n8n-workflow';

import { API_ENDPOINTS } from '../../utils/constants';
import { planeRequest } from '../../utils/helpers';

export const userGetMeDescription: INodeProperties[] = [];

export async function userGetMe(
	this: IExecuteFunctions,
): Promise<INodeExecutionData[]> {
	const response = await planeRequest.call(this, {
		method: 'GET',
		url: API_ENDPOINTS.USERS_ME,
	});

	const results = Array.isArray(response) ? response : [response];
	return this.helpers.returnJsonArray(results);
}
