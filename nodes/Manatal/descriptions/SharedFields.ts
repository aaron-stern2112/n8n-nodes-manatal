import type { INodeProperties } from 'n8n-workflow';

type Modes = NonNullable<INodeProperties['modes']>;

function idMode(resourceName: string): Modes[number] {
	return {
		displayName: 'By ID',
		name: 'id',
		type: 'string',
		placeholder: 'e.g. 42',
		validation: [
			{
				type: 'regex',
				properties: {
					regex: '^[0-9]+$',
					errorMessage: `Must be a numeric ${resourceName} ID`,
				},
			},
		],
	};
}

function urlMode(resourceName: string): Modes[number] {
	return {
		displayName: 'By URL',
		name: 'url',
		type: 'string',
		placeholder: `e.g. https://app.manatal.com/.../${resourceName.toLowerCase()}s/42/`,
		validation: [
			{
				type: 'regex',
				properties: {
					regex: '\\d+/?(?:[?#].*)?$',
					errorMessage: `Must end with a numeric ${resourceName} ID`,
				},
			},
		],
	};
}

function listMode(displayName: string, searchListMethod: string): Modes[number] {
	return {
		displayName,
		name: 'list',
		type: 'list',
		typeOptions: {
			searchListMethod,
			searchFilterRequired: false,
			searchable: true,
		},
	};
}

export const CANDIDATE_MODES: Modes = [
	listMode('From List', 'searchCandidates'),
	idMode('candidate'),
	urlMode('candidate'),
];

export const CONTACT_MODES: Modes = [
	listMode('From List', 'searchContacts'),
	idMode('contact'),
	urlMode('contact'),
];

export const JOB_MODES: Modes = [
	listMode('From List', 'searchJobs'),
	idMode('job'),
	urlMode('job'),
];

export const MATCH_MODES: Modes = [
	listMode('From List', 'searchMatches'),
	idMode('match'),
	urlMode('match'),
];

export const MATCH_STAGE_MODES: Modes = [
	listMode('From List', 'searchMatchStages'),
	idMode('match stage'),
	urlMode('match stage'),
];

export const USER_MODES: Modes = [
	listMode('From List', 'searchUsers'),
	idMode('user'),
	urlMode('user'),
];

export const ORGANIZATION_MODES: Modes = [
	listMode('From List', 'searchOrganizations'),
	idMode('organization'),
	urlMode('organization'),
];

export const INDUSTRY_MODES: Modes = [
	listMode('From List', 'searchIndustries'),
	idMode('industry'),
	urlMode('industry'),
];
