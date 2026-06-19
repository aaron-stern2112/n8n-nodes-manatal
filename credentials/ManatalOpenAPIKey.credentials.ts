import type {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class ManatalOpenAPIKey implements ICredentialType {
	name = 'manatalOpenAPIKey';

	displayName = 'Manatal Open API Token';

	icon = 'file:../nodes/Manatal/assets/manatal.svg' as const;

	documentationUrl = 'https://support.manatal.com/docs/manatal-api';

	properties: INodeProperties[] = [
		{
			displayName: 'Manatal Open API Token',
			name: 'apiToken',
			type: 'string',
			typeOptions: { password: true },
			required: true,
			default: '',
			placeholder: 'Enter your Manatal Open API Token',
			hint: 'In Manatal, go to Administration > Features > Open API.',
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				Authorization: '=Token {{$credentials.apiToken}}',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: 'https://api.manatal.com/open/v3',
			url: '/users/',
			method: 'GET',
		},
	};
}
