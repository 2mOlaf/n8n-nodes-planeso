import type {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

import { DEFAULT_BASE_URL } from '../nodes/Plane/utils/constants';

export class PlaneApi implements ICredentialType {
	name = 'planeApi';

	displayName = 'Plane API';

	documentationUrl = 'https://developers.plane.so/api-reference/introduction';

	icon = 'file:../icons/plane.svg' as const;

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
			placeholder: 'e.g. my-team',
			description: 'The workspace slug from your Plane URL (e.g. "my-team" from app.plane.so/my-team/). Do not include slashes.',
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
			url: '={{"/api/v1/workspaces/" + $credentials.workspaceSlug + "/projects/"}}',
		},
	};
}
