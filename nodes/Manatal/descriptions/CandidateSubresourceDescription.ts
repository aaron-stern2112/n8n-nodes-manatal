import type { INodeProperties } from 'n8n-workflow';
import { CANDIDATE_MODES, MATCH_MODES } from './SharedFields';

// ── CANDIDATE NATIONALITY ─────────────────────────────────────────────────────

export const candidateNationalityOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['candidateNationality'] } },
		options: [
			{ name: 'Add', value: 'add', action: 'Add a nationality', description: 'Add a nationality to a candidate' },
			{ name: 'Get', value: 'get', action: 'Get a nationality', description: 'Retrieve a nationality entry by ID' },
			{ name: 'Get Many', value: 'getMany', action: 'Get many nationalities', description: 'Retrieve all nationalities for a candidate' },
			{ name: 'Update', value: 'update', action: 'Update a nationality', description: 'Update a nationality entry' },
		],
		default: 'getMany',
	},
];

export const candidateNationalityFields: INodeProperties[] = [
	{
		displayName: 'Candidate ID',
		name: 'candidateId',
		type: 'resourceLocator',
		required: true,
		default: { mode: 'list', value: '' },
		hint: 'Use a Candidate Get Many step upstream to retrieve IDs',
		modes: CANDIDATE_MODES,
		displayOptions: { show: { resource: ['candidateNationality'] } },
		description: 'Numeric ID of the candidate',
	},
	{
		displayName: 'Nationality ID',
		name: 'nationalityId',
		type: 'string',
		required: true,
		default: '',
		placeholder: 'e.g. 7',
		hint: 'Use a Candidate Nationality → Get Many step upstream to retrieve IDs',
		displayOptions: { show: { resource: ['candidateNationality'], operation: ['get', 'update'] } },
		description: 'Numeric ID of the nationality entry',
	},
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		default: false,
		displayOptions: { show: { resource: ['candidateNationality'], operation: ['getMany'] } },
		description: 'Whether to return all results or only up to a given limit',
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		typeOptions: { minValue: 1, maxValue: 100 },
		default: 10,
		displayOptions: { show: { resource: ['candidateNationality'], operation: ['getMany'], returnAll: [false] } },
		description: 'Max number of results to return',
	},
	{
		displayName: 'Country',
		name: 'country',
		type: 'options',
		required: true,
		default: '',
		typeOptions: { loadOptionsMethod: 'getNationalities' },
		displayOptions: { show: { resource: ['candidateNationality'], operation: ['add'] } },
		description: 'Country for this nationality',
	},
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: { show: { resource: ['candidateNationality'], operation: ['update'] } },
		options: [
			{
				displayName: 'Country',
				name: 'country',
				type: 'options',
				default: '',
				typeOptions: { loadOptionsMethod: 'getNationalities' },
				description: 'Country for this nationality',
			},
		],
	},
];

// ── CANDIDATE RESUME ──────────────────────────────────────────────────────────

export const candidateResumeOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['candidateResume'] } },
		options: [
			{ name: 'Get', value: 'get', action: 'Get resumes', description: 'Retrieve all resume versions for a candidate' },
			{ name: 'Upload', value: 'upload', action: 'Upload a resume', description: 'Upload a resume URL for a candidate' },
		],
		default: 'get',
	},
];

export const candidateResumeFields: INodeProperties[] = [
	{
		displayName: 'Candidate ID',
		name: 'candidateId',
		type: 'resourceLocator',
		required: true,
		default: { mode: 'list', value: '' },
		hint: 'Use a Candidate Get Many step upstream to retrieve IDs',
		modes: CANDIDATE_MODES,
		displayOptions: { show: { resource: ['candidateResume'] } },
		description: 'Numeric ID of the candidate',
	},
	{
		displayName: 'Resume File URL',
		name: 'resume_file',
		type: 'string',
		required: true,
		default: '',
		placeholder: 'https://example.com/resume.pdf',
		displayOptions: { show: { resource: ['candidateResume'], operation: ['upload'] } },
		description: 'URL pointing to the resume file (PDF, DOC, DOCX, or RTF)',
	},
];

// ── CANDIDATE SOCIAL MEDIA ────────────────────────────────────────────────────

export const candidateSocialMediaOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['candidateSocialMedia'] } },
		options: [
			{ name: 'Create', value: 'create', action: 'Create a social media profile', description: 'Add a social media profile to a candidate' },
			{ name: 'Get', value: 'get', action: 'Get a social media profile', description: 'Retrieve a social media profile by ID' },
			{ name: 'Get Many', value: 'getMany', action: 'Get many social media profiles', description: 'Retrieve all social media profiles for a candidate' },
		],
		default: 'getMany',
	},
];

export const candidateSocialMediaFields: INodeProperties[] = [
	{
		displayName: 'Candidate ID',
		name: 'candidateId',
		type: 'resourceLocator',
		required: true,
		default: { mode: 'list', value: '' },
		hint: 'Use a Candidate Get Many step upstream to retrieve IDs',
		modes: CANDIDATE_MODES,
		displayOptions: { show: { resource: ['candidateSocialMedia'] } },
		description: 'Numeric ID of the candidate',
	},
	{
		displayName: 'Social Media ID',
		name: 'socialMediaId',
		type: 'string',
		required: true,
		default: '',
		placeholder: 'e.g. 7',
		hint: 'Use a Candidate Social Media → Get Many step upstream to retrieve IDs',
		displayOptions: { show: { resource: ['candidateSocialMedia'], operation: ['get'] } },
		description: 'Numeric ID of the social media profile',
	},
	{
		displayName: 'Platform',
		name: 'social_media',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['candidateSocialMedia'], operation: ['create'] } },
		description: 'Platform slug (e.g. linkedin, twitter)',
		placeholder: 'linkedin',
	},
	{
		displayName: 'Profile URL',
		name: 'social_media_url',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['candidateSocialMedia'], operation: ['create'] } },
		description: 'Full URL of the social media profile',
		placeholder: 'https://linkedin.com/in/username',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: { show: { resource: ['candidateSocialMedia'], operation: ['create'] } },
		options: [
			{
				displayName: 'To Be Scraped',
				name: 'to_be_scraped',
				type: 'boolean',
				default: false,
				description: 'Whether Manatal should enrich this profile',
			},
			{
				displayName: 'Username',
				name: 'username',
				type: 'string',
				default: '',
				description: 'Username on the platform',
			},
		],
	},
	{
		displayName: 'Filters',
		name: 'filters',
		type: 'collection',
		placeholder: 'Add Filter',
		default: {},
		displayOptions: { show: { resource: ['candidateSocialMedia'], operation: ['getMany'] } },
		options: [
			{
				displayName: 'Platform',
				name: 'social_media',
				type: 'string',
				default: '',
				description: 'Filter by platform slug (e.g. linkedin)',
			},
		],
	},
];

// ── CANDIDATE MATCH VIEW (read-only) ──────────────────────────────────────────

export const candidateMatchViewOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['candidateMatch'] } },
		options: [
			{ name: 'Get', value: 'get', action: 'Get a match', description: 'Retrieve a pipeline match by ID' },
			{ name: 'Get Many', value: 'getMany', action: 'Get many matches', description: 'Retrieve all pipeline matches for a candidate' },
		],
		default: 'getMany',
	},
];

export const candidateMatchViewFields: INodeProperties[] = [
	{
		displayName: 'Candidate ID',
		name: 'candidateId',
		type: 'resourceLocator',
		required: true,
		default: { mode: 'list', value: '' },
		hint: 'Use a Candidate Get Many step upstream to retrieve IDs',
		modes: CANDIDATE_MODES,
		displayOptions: { show: { resource: ['candidateMatch'] } },
		description: 'Numeric ID of the candidate',
	},
	{
		displayName: 'Match ID',
		name: 'matchId',
		type: 'resourceLocator',
		required: true,
		default: { mode: 'list', value: '' },
		hint: 'Use a Candidate Match Get Many step upstream to retrieve IDs',
		modes: MATCH_MODES,
		displayOptions: { show: { resource: ['candidateMatch'], operation: ['get'] } },
		description: 'Numeric ID of the match',
	},
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		default: false,
		displayOptions: { show: { resource: ['candidateMatch'], operation: ['getMany'] } },
		description: 'Whether to return all results or only up to a given limit',
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		typeOptions: { minValue: 1, maxValue: 100 },
		default: 10,
		displayOptions: { show: { resource: ['candidateMatch'], operation: ['getMany'], returnAll: [false] } },
		description: 'Max number of results to return',
	},
];
