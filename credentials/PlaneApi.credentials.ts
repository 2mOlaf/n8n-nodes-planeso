import type {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

import { API_ENDPOINTS, DEFAULT_BASE_URL } from '../nodes/Plane/utils/constants';

export class PlaneApi implements ICredentialType {
	name = 'planeApi';

	displayName = 'Plane API';

	documentationUrl = 'https://developers.plane.so/api-reference/introduction';

	icon = 'file:../icons/plane.png' as const;

	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: { password: true },
			required: true,
			default: '',
		},
		{
			displayName: 'Base URL',
			name: 'baseUrl',
			type: 'string',
			default: DEFAULT_BASE_URL,
			description: 'The base URL of your Plane instance. Use https://api.plane.so for cloud or your self-hosted URL.',
		},
		{
			displayName: 'Workspace Slug',
			name: 'workspaceSlug',
			type: 'string',
			required: true,
			default: '',
			description: 'Your workspace identifier (from the URL)',
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				'X-API-Key': '={{$credentials.apiKey}}',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: '={{$credentials.baseUrl}}',
			url: API_ENDPOINTS.USERS_ME,
		},
	};
}
