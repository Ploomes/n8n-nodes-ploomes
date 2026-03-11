import {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class PloomesApi implements ICredentialType {
	name = 'ploomesApi';
	displayName = 'Ploomes API';
	documentationUrl = 'https://developers.ploomes.com/';
	properties: INodeProperties[] = [
		{
			displayName: 'User-Key',
			name: 'userKey',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			required: true,
			description: 'The User-Key for authenticating with the Ploomes API. Obtain it from your Ploomes account settings or via the authentication endpoint.',
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				'User-Key': '={{$credentials.userKey}}',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: 'https://api2.ploomes.com',
			url: '/Account',
			method: 'GET',
			qs: {
				$top: '1',
				$select: 'Id',
			},
		},
	};
}
