import type { INodeProperties } from 'n8n-workflow';
import { CANDIDATE_MODES, JOB_MODES, MATCH_MODES, MATCH_STAGE_MODES, USER_MODES } from './SharedFields';

export const matchOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: { resource: ['match'] },
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				action: 'Create a match',
				description: 'Add a candidate to a job pipeline',
			},
			{
				name: 'Get',
				value: 'get',
				action: 'Get a match',
				description: 'Retrieve a match by ID',
			},
			{
				name: 'Get Many',
				value: 'getMany',
				action: 'Get many matches',
				description: 'Retrieve a list of matches',
			},
			{
				name: 'Update',
				value: 'update',
				action: 'Update a match',
				description: 'Update a match (e.g. move pipeline stage)',
			},
		],
		default: 'getMany',
	},
];

export const matchFields: INodeProperties[] = [
	{
		displayName: 'Match ID',
		name: 'matchId',
		type: 'resourceLocator',
		required: true,
		default: { mode: 'list', value: '' },
		hint: 'Use a Match Get Many step upstream to retrieve IDs',
		modes: MATCH_MODES,
		displayOptions: {
			show: { resource: ['match'], operation: ['get'] },
		},
		description: 'Numeric ID of the match',
	},

	// ── GET MANY ─────────────────────────────────────────────────────────
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		default: false,
		displayOptions: {
			show: { resource: ['match'], operation: ['getMany'] },
		},
		description: 'Whether to return all results or only up to a given limit',
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		typeOptions: { minValue: 1, maxValue: 100 },
		default: 10,
		displayOptions: {
			show: { resource: ['match'], operation: ['getMany'], returnAll: [false] },
		},
		description: 'Max number of results to return',
	},
	{
		displayName: 'Filters',
		name: 'filters',
		type: 'collection',
		placeholder: 'Add Filter',
		default: {},
		displayOptions: {
			show: { resource: ['match'], operation: ['getMany'] },
		},
		options: [
			{
				displayName: 'Created At (From)',
				name: 'created_at__gte',
				type: 'dateTime',
				default: '',
				description: 'Return matches created on or after this date',
			},
			{
				displayName: 'Created At (To)',
				name: 'created_at__lte',
				type: 'dateTime',
				default: '',
				description: 'Return matches created on or before this date',
			},
			{
				displayName: 'Dropped At (From)',
				name: 'dropped_at__gte',
				type: 'dateTime',
				default: '',
			},
			{
				displayName: 'Dropped At (To)',
				name: 'dropped_at__lte',
				type: 'dateTime',
				default: '',
			},
			{
				displayName: 'External ID',
				name: 'external_id',
				type: 'string',
				default: '',
				description: 'Filter by the external system ID',
			},
			{
				displayName: 'Hired At (From)',
				name: 'hired_at__gte',
				type: 'dateTime',
				default: '',
			},
			{
				displayName: 'Hired At (To)',
				name: 'hired_at__lte',
				type: 'dateTime',
				default: '',
			},
			{
				displayName: 'Interview At (From)',
				name: 'interview_at__gte',
				type: 'dateTime',
				default: '',
			},
			{
				displayName: 'Interview At (To)',
				name: 'interview_at__lte',
				type: 'dateTime',
				default: '',
			},
			{
				displayName: 'Offer At (From)',
				name: 'offer_at__gte',
				type: 'dateTime',
				default: '',
			},
			{
				displayName: 'Offer At (To)',
				name: 'offer_at__lte',
				type: 'dateTime',
				default: '',
			},
			{
				displayName: 'Stage IDs',
				name: 'stage__in',
				type: 'string',
				default: '',
				description: 'Filter by stage IDs (comma-separated, e.g. "1,2,3")',
			},
			{
				displayName: 'Submitted At (From)',
				name: 'submitted_at__gte',
				type: 'dateTime',
				default: '',
			},
			{
				displayName: 'Submitted At (To)',
				name: 'submitted_at__lte',
				type: 'dateTime',
				default: '',
			},
			{
				displayName: 'Updated At (From)',
				name: 'updated_at__gte',
				type: 'dateTime',
				default: '',
			},
			{
				displayName: 'Updated At (To)',
				name: 'updated_at__lte',
				type: 'dateTime',
				default: '',
			},
		],
	},

	// ── CREATE ───────────────────────────────────────────────────────────
	{
		displayName: 'Candidate ID',
		name: 'candidateId',
		type: 'resourceLocator',
		required: true,
		default: { mode: 'list', value: '' },
		hint: 'Use a Candidate Get Many step upstream to retrieve IDs',
		modes: CANDIDATE_MODES,
		displayOptions: {
			show: { resource: ['match'], operation: ['create'] },
		},
		description: 'Numeric ID of the candidate to add to the job',
	},
	{
		displayName: 'Job ID',
		name: 'jobId',
		type: 'resourceLocator',
		required: true,
		default: { mode: 'list', value: '' },
		hint: 'Use a Job Get Many step upstream to retrieve IDs',
		modes: JOB_MODES,
		displayOptions: {
			show: { resource: ['match'], operation: ['create'] },
		},
		description: 'The ID of the job to add the candidate to',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: { resource: ['match'], operation: ['create'] },
		},
		options: [
			{
				displayName: 'Custom Fields',
				name: 'custom_fields',
				type: 'json',
				default: '{}',
				description:
					'Custom field values as a JSON object. Must be a full object — partial updates will overwrite existing values.',
			},
			{
				displayName: 'Dropped At',
				name: 'dropped_at',
				type: 'dateTime',
				default: '',
				description: 'Date the candidate was dropped from the pipeline',
			},
			{
				displayName: 'External ID',
				name: 'external_id',
				type: 'string',
				default: '',
				description: 'ID of the match in the API consumer system',
			},
			{
				displayName: 'Hired At',
				name: 'hired_at',
				type: 'dateTime',
				default: '',
				description: 'Date the candidate was hired',
			},
			{
				displayName: 'Interview At',
				name: 'interview_at',
				type: 'dateTime',
				default: '',
				description: 'Date the candidate was last interviewed',
			},
			{
				displayName: 'Is Active',
				name: 'is_active',
				type: 'boolean',
				default: true,
				description: 'Whether this match is active in the pipeline',
			},
			{
				displayName: 'Offer At',
				name: 'offer_at',
				type: 'dateTime',
				default: '',
				description: 'Date an offer was made to the candidate',
			},
			{
				displayName: 'Owner',
				name: 'owner',
				type: 'resourceLocator',
				default: { mode: 'list', value: '' },
				description: 'User who owns this match record',
				modes: USER_MODES,
			},
			{
				displayName: 'Submitted At',
				name: 'submitted_at',
				type: 'dateTime',
				default: '',
				description: 'Date the candidate was added to the job',
			},
		],
	},

	// ── UPDATE ───────────────────────────────────────────────────────────
	{
		displayName: 'Match ID',
		name: 'matchId',
		type: 'resourceLocator',
		required: true,
		default: { mode: 'list', value: '' },
		hint: 'Use a Match Get Many step upstream to retrieve IDs',
		modes: MATCH_MODES,
		displayOptions: {
			show: { resource: ['match'], operation: ['update'] },
		},
		description: 'Numeric ID of the match to update',
	},
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: { resource: ['match'], operation: ['update'] },
		},
		options: [
			{
				displayName: 'Custom Fields',
				name: 'custom_fields',
				type: 'json',
				default: '{}',
				description:
					'Custom field values as a JSON object. Must be a full object — partial updates will overwrite existing values.',
			},
			{
				displayName: 'Dropped At',
				name: 'dropped_at',
				type: 'dateTime',
				default: '',
				description: 'Date the candidate was dropped from the pipeline',
			},
			{
				displayName: 'External ID',
				name: 'external_id',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Hired At',
				name: 'hired_at',
				type: 'dateTime',
				default: '',
				description: 'Date the candidate was hired',
			},
			{
				displayName: 'Interview At',
				name: 'interview_at',
				type: 'dateTime',
				default: '',
				description: 'Date the candidate was last interviewed',
			},
			{
				displayName: 'Is Active',
				name: 'is_active',
				type: 'boolean',
				default: true,
				description: 'Whether this match is active in the pipeline',
			},
			{
				displayName: 'Offer At',
				name: 'offer_at',
				type: 'dateTime',
				default: '',
				description: 'Date an offer was made to the candidate',
			},
			{
				displayName: 'Owner',
				name: 'owner',
				type: 'resourceLocator',
				default: { mode: 'list', value: '' },
				modes: USER_MODES,
			},
			{
				displayName: 'Stage',
				name: 'job_pipeline_stage',
				type: 'resourceLocator',
				default: { mode: 'list', value: '' },
				modes: MATCH_STAGE_MODES,
				description: 'The pipeline stage for this match',
			},
			{
				displayName: 'Submitted At',
				name: 'submitted_at',
				type: 'dateTime',
				default: '',
				description: 'Date the candidate was added to the job',
			},
		],
	},
];
