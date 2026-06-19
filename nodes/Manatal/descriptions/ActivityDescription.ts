import type { INodeProperties } from 'n8n-workflow';
import { CANDIDATE_MODES, CONTACT_MODES, JOB_MODES, MATCH_MODES, ORGANIZATION_MODES } from './SharedFields';

const ALL_ACTIVITY_RESOURCES = [
	'candidateActivity',
	'jobActivity',
	'matchActivity',
	'organizationActivity',
	'contactActivity',
];

export const activityOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ALL_ACTIVITY_RESOURCES } },
		options: [
			{ name: 'Get', value: 'get', action: 'Get an activity', description: 'Retrieve an activity by ID' },
			{ name: 'Get Many', value: 'getMany', action: 'Get many activities', description: 'Retrieve all activities' },
		],
		default: 'getMany',
	},
];

export const activityFields: INodeProperties[] = [
	// ── Parent ID fields ──────────────────────────────────────────────────

	{
		displayName: 'Candidate ID',
		name: 'candidateId',
		type: 'resourceLocator',
		required: true,
		default: { mode: 'list', value: '' },
		hint: 'Use a Candidate Get Many step upstream to retrieve IDs',
		modes: CANDIDATE_MODES,
		displayOptions: { show: { resource: ['candidateActivity'] } },
		description: 'Numeric ID of the candidate',
	},
	{
		displayName: 'Job ID',
		name: 'jobId',
		type: 'resourceLocator',
		required: true,
		default: { mode: 'list', value: '' },
		hint: 'Use a Job Get Many step upstream to retrieve IDs',
		modes: JOB_MODES,
		displayOptions: { show: { resource: ['jobActivity'] } },
		description: 'Numeric ID of the job',
	},
	{
		displayName: 'Match ID',
		name: 'matchId',
		type: 'resourceLocator',
		required: true,
		default: { mode: 'list', value: '' },
		hint: 'Use a Match Get Many step upstream to retrieve IDs',
		modes: MATCH_MODES,
		displayOptions: { show: { resource: ['matchActivity'] } },
		description: 'Numeric ID of the match',
	},
	{
		displayName: 'Organization ID',
		name: 'organizationId',
		type: 'resourceLocator',
		required: true,
		default: { mode: 'list', value: '' },
		hint: 'Use an Organization Get Many step upstream to retrieve IDs',
		modes: ORGANIZATION_MODES,
		displayOptions: { show: { resource: ['organizationActivity'] } },
		description: 'Numeric ID of the organization',
	},
	{
		displayName: 'Contact ID',
		name: 'contactId',
		type: 'resourceLocator',
		required: true,
		default: { mode: 'list', value: '' },
		hint: 'Use a Contact Get Many step upstream to retrieve IDs',
		modes: CONTACT_MODES,
		displayOptions: { show: { resource: ['contactActivity'] } },
		description: 'Numeric ID of the contact',
	},

	// ── Activity ID (get) ─────────────────────────────────────────────────

	{
		displayName: 'Activity ID',
		name: 'activityId',
		type: 'string',
		required: true,
		default: '',
		placeholder: 'e.g. 7',
		hint: 'Use an Activity → Get Many step upstream to retrieve IDs',
		displayOptions: { show: { resource: ALL_ACTIVITY_RESOURCES, operation: ['get'] } },
		description: 'Numeric ID of the activity',
	},
];
